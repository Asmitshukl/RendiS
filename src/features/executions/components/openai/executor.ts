import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai"
import Handlebars from "handlebars";
import { openAiChannel } from "@/inngest/channels/openai";

Handlebars.registerHelper("json",(context) =>{
    const stringified = JSON.stringify(context , null ,2);
    const safeString = new Handlebars.SafeString(stringified);

    return safeString;
});
  

type OpenAiData =  {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const OpenAiExecutor : NodeExecutor<OpenAiData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
})=>{

    await publish(
        openAiChannel().status({
            nodeId,
            status:"loading"
        })
    );

    if(!data.variableName){
        await publish(
            openAiChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("OpenAi node: Variable name is missing");
    }

    if(!data.userPrompt){
        await publish(
            openAiChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("OpenAi node: User Prompt is missing");
    }

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context)
                                        : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);


    //to fix: fetch the credential of the user nrather using our owns

    const credentialValue = process.env.OPENAI_API_KEY!;

    const OpenAi = createOpenAI({
        apiKey : credentialValue,
    })

    try{
        const { steps } = await step.ai.wrap("openai-generate-text" , 
            generateText,
            {
                model : OpenAi("gpt-4.1"),
                system : systemPrompt,
                prompt : userPrompt,
                experimental_telemetry:{
                    isEnabled : true,
                    recordInputs : true,
                    recordOutputs : true,
                }
            },
        );

        const text = steps[0].content[0].type === "text" ? 
                                            steps[0].content[0].text
                                            : "" ;
        await publish(
            openAiChannel().status({
                nodeId,
                status : "success",
            }),
        );

        return {
            ...context,
            [data.variableName] :{
                aiResponse : text
            }
        }
    }catch(error){
        await publish(
            openAiChannel().status({
                nodeId,
                status : "error",
            }),
        );
        throw error;
    }

}
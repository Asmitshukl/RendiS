import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import Handlebars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/db";

Handlebars.registerHelper("json",(context) =>{
    const stringified = JSON.stringify(context , null ,2);
    const safeString = new Handlebars.SafeString(stringified);

    return safeString;
});
  

type GeminiData =  {
    variableName?: string;
    credentialId?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const GeminiExecutor : NodeExecutor<GeminiData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
})=>{

    await publish(
        geminiChannel().status({
            nodeId,
            status:"loading"
        })
    );

    if(!data.variableName){
        await publish(
            geminiChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("Gemini node: Variable name is missing");
    }

    if(!data.credentialId){
        await publish(
            geminiChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("Gemini node: CredentialId is missing");
    }

    if(!data.userPrompt){
        await publish(
            geminiChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("Gemini node: User Prompt is missing");
    }

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context)
                                        : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);


    const credential = await step.run("get-credential",()=>{
        return prisma.credential.findUnique({
            where:{
                id: data.credentialId
            },
        });
    });

    if(!credential){
        throw new NonRetriableError("Gemini Node : credential not found");
    }

    const google = createGoogleGenerativeAI({
        apiKey : credential.value,
    })

    try{
        const { steps } = await step.ai.wrap("gemini-generate-text" , 
            generateText,
            {
                model : google("gemini-2.0-flash"),
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
            geminiChannel().status({
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
            geminiChannel().status({
                nodeId,
                status : "error",
            }),
        );
        throw error;
    }

}
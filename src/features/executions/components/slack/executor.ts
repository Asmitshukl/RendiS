import type { NodeExecutor } from "@/features/executions/types";
import {decode} from "html-entities";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import ky from "ky";

Handlebars.registerHelper("json",(context) =>{
    const stringified = JSON.stringify(context , null ,2);
    const safeString = new Handlebars.SafeString(stringified);

    return safeString;
});
  

type SlackData =  {
    variableName?: string;
    webhookUrl?: string;
    content? : string;
};

export const SlackExecutor : NodeExecutor<SlackData> = async ({
    data,
    nodeId, 
    context,
    step,
    publish
})=>{

    await publish(
        slackChannel().status({
            nodeId,
            status:"loading"
        })
    );


    if(!data.webhookUrl){
        await publish(
            slackChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("Slack node: Webhook URL is missing");
    }

    if(!data.content){
        await publish(
            slackChannel().status({
                nodeId,
                status : "error"
            })
        );
        throw new NonRetriableError("Slack node: message content is missing");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);

    
    try{
        const result = await step.run("slack-webhook",async()=>{
            await ky.post(data.webhookUrl!,{
                json:{
                    text : content,
                }
            });

            if(!data.variableName){
                await publish(
                    slackChannel().status({
                        nodeId,
                        status : "error"
                    })
                );
                throw new NonRetriableError("Slack node: Variable name is missing");
            }

            return {
                ...context,
                [data.variableName]:{
                    messageContent:content.slice(0,2000),
                }
            }
        })

        await publish(
            slackChannel().status({
                nodeId,
                status : "success",
            }),
        );

        return result;
    }catch(error){
        await publish(
            slackChannel().status({
                nodeId,
                status : "error",
            }),
        );
        throw error;
    }

}
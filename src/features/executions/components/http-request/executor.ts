import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as Kyoptions } from "ky"
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json",(context) =>{
    const stringified = JSON.stringify(context , null ,2);
    const safeString = new Handlebars.SafeString(stringified);

    return safeString;
});
  

type HttpRequestData =  {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
}

export const HttpRequestExecutor : NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
})=>{

    await publish(
        httpRequestChannel().status({
            nodeId,
            status:"loading"
        })
    );


    try{
        const result = await step.run("http-request",async () =>{
            if(!data.endpoint){
            await publish(
            httpRequestChannel().status({
                nodeId,
                status:"error"
            })
            );
            throw new NonRetriableError("Http request node: No endpoint configured");
        }

            if(!data.variableName){
                await publish(
                httpRequestChannel().status({
                    nodeId,
                    status:"error"
                })
                );
                throw new NonRetriableError("variableName not configured");
            }

            if(!data.method){
                await publish(
                httpRequestChannel().status({
                    nodeId,
                    status:"error"
                })
                );
                throw new NonRetriableError("method not configured");
            }
            
        const endpoint = Handlebars.compile(data.endpoint)(context)
        const method = data.method ;

        const options: Kyoptions = {method};

        if(["POST" , "PUT" , "PATCH"].includes(method)){
                const resolved = Handlebars.compile(data.body || "{}")(context);
                JSON.parse(resolved);
                options.body = resolved;
                options.headers ={
                    "Content-Type":"application/json",
                };
        }

        const response = await ky(endpoint , options);
        const contentType = response.headers.get("content-type")
        const responseData = contentType?.includes("application/json") ?
                                         await response.json() : await response.text();
        const responsePayload = {
            httpResponse:{
                status:response.status,
                statusText:response.statusText,
                data:responseData
            },
        };

        return {
            ...context,
            [data.variableName]:responsePayload,
        }
        
    } );

    //now i did this because in the lecture he did no hve to write nything like thsi but got a finalization 
    //but for me there was no finalization and thats why i did this might be because he was on a older versiion and thats why 
    // const finalResult = await step.run("finalize", async () => {
    //     return {
    //         success: true,
    //         data: result,
    //     };
    //     });

    await publish(
        httpRequestChannel().status({
            nodeId,
            status:"success"
        })
        );
  
    return result;
    }catch(err){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status:"success"
        })
        );
        throw err;
    }
}
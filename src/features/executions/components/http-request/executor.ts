import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as Kyoptions } from "ky"

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
    step
})=>{

    if(!data.endpoint){
        throw new NonRetriableError("Http request node: No endpoint configured");
    }

    if(!data.variableName){
        throw new NonRetriableError("variableName not configured");
    }


    const result = await step.run("http-request",async () =>{
        const endpoint = data.endpoint! ;
        const method = data.method || "GET"

        const options: Kyoptions = {method};

        if(["POST" , "PUT" , "PATCH"].includes(method)){
                options.body = data.body;
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

        if(data.variableName){
        return {
            ...context,
            [data.variableName]:responsePayload,
        }
        }

        //fallback to direct httpresponse for backward compatibility
        return {
            ...context,
            ...responsePayload,
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

  
    return result;

}
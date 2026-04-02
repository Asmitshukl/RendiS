import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as Kyoptions } from "ky"

type HttpRequestData =  {
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


    const result = await step.run("http-request",async () =>{
        const endpoint = data.endpoint! ;
        const method = data.method || "GET"

        const options: Kyoptions = {method};

        if(["POST" , "PUT" , "PATCH"].includes(method)){
                options.body = data.body;
        }

        const response = await ky(endpoint , options);
        const contentType = response.headers.get("content-type")
        const responseData = contentType?.includes("application/json") ?
                                         await response.json() : await response.text();

        return {
            ...context,
            httpResponse:{
                status:response.status,
                statusText:response.statusText,
                data:responseData
            }
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
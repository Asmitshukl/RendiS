import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch ,trpc } from "@/trpc/servere";

//the type we are using in here will be automatically be detected without the need of
//maually describing the type of the params we are passing
type Input = inferInput<typeof trpc.credentials.getMany>

export const prefetchCredentials = (params : Input)=>{
    return prefetch(trpc.credentials.getMany.queryOptions(params));

}

//prefetch a single workflow
export const prefetchCredential = (id:string)=>{
    return prefetch(trpc.credentials.getOne.queryOptions({id}));
}


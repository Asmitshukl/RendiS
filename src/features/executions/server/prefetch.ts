import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch ,trpc } from "@/trpc/servere";

//the type we are using in here will be automatically be detected without the need of
//maually describing the type of the params we are passing
type Input = inferInput<typeof trpc.executions.getMany>

export const prefetchExecutions = (params : Input)=>{
    return prefetch(trpc.executions.getMany.queryOptions(params));

}

//prefetch a single exeutions
export const prefetchExecution = (id:string)=>{
    return prefetch(trpc.executions.getOne.queryOptions({id}));
}


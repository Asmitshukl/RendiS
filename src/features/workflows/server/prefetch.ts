import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch ,trpc } from "@/trpc/servere";

//the type we are using in here will be automatically be detected without the need of
//maually describing the type of the params we are passing
type Input = inferInput<typeof trpc.worflows.getMany>

export const prefetchWorkflows = (params : Input)=>{
    return prefetch(trpc.worflows.getMany.queryOptions(params));

}
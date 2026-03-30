import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkFlowsParams } from "./use-workflows-params";


//hook to fetch all workflows using suspense
export const useSuspenseWorkflows = () =>{
    const trpc = useTRPC();
    const [params] = useWorkFlowsParams();

    return useSuspenseQuery(trpc.worflows.getMany.queryOptions(params));
};


//hook to create a workflow
export const useCreateWorkflow = () =>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.worflows.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow "${data.name}" created`);
            queryClient.invalidateQueries(
                trpc.worflows.getMany.queryOptions({}),
            );
        },
        onError : (error)=>{
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }),
)
};

//hook to remove a workflow
export const useRemoveWorkflow= () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.worflows.remove.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.worflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.worflows.getOne.queryFilter({id:data.id}),
                )
            }
        })
    )
}
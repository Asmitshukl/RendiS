import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


//hook to fetch all workflows using suspense
export const useSuspenseWorkflows = () =>{
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.worflows.getMany.queryOptions());
};


//hook to create a workflow
export const useCreateWorkflow = () =>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.worflows.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow ${data.name} created`);
            queryClient.invalidateQueries(
                trpc.worflows.getMany.queryOptions(),
            );
        },
        onError : (error)=>{
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }),
)
}
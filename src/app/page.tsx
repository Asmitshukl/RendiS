"use client"
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/servere";
import { LogoutButton } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

 const Page=  ()=>{
  // await requireAuth();

  // const data =await caller.getUsers();
  const trpc = useTRPC();
  const queryClient=useQueryClient();
  const { data } = useQuery(trpc.getWorkFlows.queryOptions());

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess:()=>{
      toast.success("Ai job queued ");
    }
  }));

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess : ()=>{
      queryClient.invalidateQueries(trpc.getWorkFlows.queryOptions())
    }
  }));

  return (

    <div className={"text-red-500 min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6"}>
      protected server component
      {JSON.stringify(data)};
      <Button disabled={testAi.isPending} onClick={()=> testAi.mutate()}>Test AI</Button>
      <Button disabled={create.isPending} onClick={()=> create.mutate()}>
        Create Workflow
      </Button>
      <LogoutButton/>
    </div>
  )
}

export default Page; 
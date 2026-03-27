import { cn } from "@/lib/utils";
import { getQueryClient, trpc } from "@/trpc/servere";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Client from "./client";

 const Page=async ()=>{
  const queryClient=getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    //wht we re doing here is we re creating  boundry between the client component and the server 
    //component thsi is is very important becuse this is how we usd to write the industry level code

    <div className={cn("text-red-500 min-h-screen min-w-screen flex items-center justify-center")}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Client/>
      </HydrationBoundary>
    </div>
  )
}

export default Page;
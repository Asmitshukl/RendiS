"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

const  Client=()=>{
    const trpc=useTRPC();
    const {data :users}=useSuspenseQuery(trpc.getUsers.queryOptions());
    return <div>
        client componsnt:{JSON.stringify(users)}
    </div>
}

export default Client

//what we did here is very important to understnd becuse 
//1st tthing we could have done is fetched the data on hte server 
//comp[onent] and passsed it down to the client component but there would not been 
//ny updta or could be said if there is change in db it wouldnt be automticlally be
//refressed it would just show what the server on server side rendering data has rendered and 
//apssed it down so now here what we did created a hydatation boundary bwetween the client componenet
//and the server component and now client component passes down the data and which is now dynamic and the best method too to 
//fetch the data
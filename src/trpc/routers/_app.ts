import { z } from 'zod';
import {  createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async()=>{
    await inngest.send({name: "execute/ai"})

    return {success:true,message:"job queued"}
  }),

  getWorkFlows : protectedProcedure.query(({ ctx })=>{
    return prisma.worklow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async()=>{

    //this part will start a background job as we learned in below comments
    //this will not stop the flow and here we can do anything that might take
    await inngest.send({
      name:"app/task.created",
      data:{
        email:"mail.com"
      }
    })

    //and here we can return some data to the user as he requests
    return "completing in second"
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

//now suppose in mutation(post) route u are start an await task like processing a video or soomething 
//like that now the problem is until the process gets executed the user will have no idea
//of what to do and incase suppose there are multiple tasks which are await and any single tasks
//fail user will need to strt oer again now this will create a very major issue as this is not a 
//good user experience neither is this a god way so to fix this what are we gonna do is 
//we are going to use injest what inject helps us do is set background jobs 
//background jobs basicaly mean the user will get a response like waiting in 
//queue ore something like that which u wnat to show to the user and the jobs wiil run in the background

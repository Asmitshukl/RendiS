// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    //now here are three tasks queued one after another now suppose if any one fails what we 
    //can do is put them retry and it would get execued again if we want we can restart again
    //all the task but hte user would not wait until all the tasks get completed
    //and this is the benefit of using { inngest }
    //fetching
    await step.sleep("fetching", "3s");

    //transcribing
    await step.sleep("transcribing", "3s");

    //sending
    await step.sleep("sending-to-g", "3s");


    await step.run("create-workflow",()=>{
        return prisma.worklow.create({
            data:{
                name:"workflow-from-inngest"
            }
        })
    })
  }
);
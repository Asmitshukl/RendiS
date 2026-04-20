import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";

export const executeWorkflow = inngest.createFunction(
  //remove the retreis no in ptoductiion 
  { id: "execute-workflow" , retries: process.env.NODE_ENV === "production" ? 3 : 0 ,
    onFailure : async ({event , step})=>{
      return prisma.execution.update({
        where : {inngestEventId:event.data.event.id},
        data:{
          status:ExecutionStatus.FAILED,
          error:event.data.error.message,
          errorStack:event.data.error.stack,
        }
      });
    }
   }, { event: "workflow/execute.workflow" , 
    channels:[httpRequestChannel(), manualTriggerChannel()
      ,googleFormTriggerChannel(), stripeTriggerChannel()
      ,geminiChannel() , openAiChannel() , anthropicChannel()
      ,discordChannel() , slackChannel()
    ],
   },
  async ({event , step , publish}) =>{
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if(!inngestEventId  || !workflowId){
      throw new NonRetriableError("Event ID  or workflow ID is missing")
    }

    await step.run("create-execution",async()=>{
      return prisma.execution.create({
        data:{
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow",async()=>{
      const workflow =await prisma.worklow.findUniqueOrThrow({
        where: {id : workflowId},
        include : {
           nodes :true,
           connnections : true,
        }
      });

      return topologicalSort(workflow.nodes , workflow.connnections);

    });

    const userId = await step.run("find-user-id",async()=>{
      const workflow = await prisma.worklow.findUniqueOrThrow({
        where:{ id :workflowId },
        select:{
          userId:true
        }
      });

      return workflow.userId;
    })

    //intilize the context with 
    let context = event.data.initialData || {};

    //execute each node
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType)
      context=await executor({
        data:node.data as Record<string,unknown>,
        nodeId : node.id,
        context,
        userId,
        step,
        publish
      })
    }
    await step.run("update-execution",async ()=>{
      return prisma.execution.update({
        where: {inngestEventId , workflowId },
        data : {
          status : ExecutionStatus.SUCCESS,
          completedAt : new Date(),
          output : context
        }
      })
    })

    return { 
      workflowId,
      result : context
     };
  }
);
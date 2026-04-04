import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";

export const executeWorkflow = inngest.createFunction(
  //remove the retreis no in ptoductiion 
  { id: "execute-workflow" , retries: 0  }, { event: "workflow/execute.workflow" , 
    channels:[httpRequestChannel(), manualTriggerChannel() , googleFormTriggerChannel(), stripeTriggerChannel()],
   },
  async ({event , step , publish}) =>{
    const workflowId = event.data.workflowId;

    if(!workflowId){
      throw new NonRetriableError("Workflow ID  is missing")
    }

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

    //intilize the context with 
    let context = event.data.initialData || {};

    //execute each node
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType)
      context=await executor({
        data:node.data as Record<string,unknown>,
        nodeId : node.id,
        context,
        step,
        publish
      })
    }

    return { 
      workflowId,
      result : context
     };
  }
);
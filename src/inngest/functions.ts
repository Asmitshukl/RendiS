import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", triggers: { event: "workflow/execute.workflow" } },
  async ({event , step}) =>{
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
        step
      })
    }

    return { 
      workflowId,
      result : context
     };
  }
);
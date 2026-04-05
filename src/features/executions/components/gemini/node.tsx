"use client";

import { useReactFlow, type Node ,type NodeProps  } from "@xyflow/react"
import { memo, useState  } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  GeminiDialog, GeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminRealTimeToken } from "./actions";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type geminiNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type geminiNodeType = Node<geminiNodeData>;

export const geminiNode = memo((props : NodeProps<geminiNodeType>)=>{
    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes }= useReactFlow();
    const nodeData = props.data ;
    const description = nodeData.userPrompt
                            ? `gemini-2.0-flash : ${nodeData.userPrompt.slice(0,50)}...` 
                            : "Not COnfigured" ;

    const nodeStatus = useNodeStatus({
        nodeId : props.id ,
        channel : GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminRealTimeToken
    });

    const handleSubmit= (values : GeminiFormValues )=>{
        setNodes((nodes)=>nodes.map((node)=>{
            if(node.id === props.id){
                return {
                    ...node,
                    data:{
                        ...node.data,
                        ...values
                    }
                }
            }
            return node;
        }))
    }
    const handleOpenSettings = () => setDialogOpen(true);
    
    return (
        <>
        <GeminiDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
         /> 
          <BaseExecutionNode 
            {...props}
            id={props.id}
            icon="/logos/gemini.svg"
            name="Gemini"
            status={nodeStatus}
            description={description}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
           />
        </>
    )
    
})

geminiNode.displayName= "geminiNode";
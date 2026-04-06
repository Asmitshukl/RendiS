"use client";

import { useReactFlow, type Node ,type NodeProps  } from "@xyflow/react"
import { memo, useState  } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  OpenaAiDialog, OpenAiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenaAiRealTimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAiNodeData = {
    variableName?:string;
    credentialId?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props : NodeProps<OpenAiNodeType>)=>{
    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes }= useReactFlow();
    const nodeData = props.data ;
    const description = nodeData.userPrompt
                            ? `gpt-4.1 : ${nodeData.userPrompt.slice(0,50)}...` 
                            : "Not COnfigured" ;

    const nodeStatus = useNodeStatus({
        nodeId : props.id ,
        channel : OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenaAiRealTimeToken
    });

    const handleSubmit= (values : OpenAiFormValues )=>{
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
        <OpenaAiDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
         /> 
          <BaseExecutionNode 
            {...props}
            id={props.id}
            icon="/logos/openai.svg"
            name="OpenAI"
            status={nodeStatus}
            description={description}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
           />
        </>
    )
    
})

OpenAiNode.displayName= "OpenAiNode";
"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo  } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

export const IntialNode = memo((props : NodeProps ) => {
     return (
        <WorkflowNode 
         name="Intial node"
         description="Click to add a node"
         >
        <PlaceholderNode
          {...props}
          onClick={()=>{}}
        >
            <div className="cursor-pointer flex items-center justify-center">
                <PlusIcon className="size-4" />
            </div>
        </PlaceholderNode>
        </WorkflowNode>
     )
});

IntialNode.displayName = "IntialNode" 
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleformTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealTimeToken } from "./actions";

export const GoogleFormTrigger = memo((props : NodeProps)=>{
    const [dialogOpen , setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
                nodeId : props.id ,
                channel : GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
                topic: "status",
                refreshToken: fetchGoogleFormTriggerRealTimeToken
            });

    const handleOpenSettings = () => setDialogOpen(true)

    return (
        <> 
        <GoogleformTriggerDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
         />
          <BaseTriggerNode 
             {...props}
             icon="/logos/googleform.svg"
             name="Google Form"
             description="When form is submitted"
             status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
           />
           
        </>

    )
})
"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Props {
    open : boolean;
    onOpenChange : ( open : boolean )=> void;
}

export const StripeTriggerDialog = ({
    open,
    onOpenChange
}: Props)=>{
    const params = useParams();
    const workflowId = params.workflowId as string;

    //construct the webhookurl
    const baseUrl =process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
    
    const copyToClipboard = async () =>{
        try{
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook Url copied to clipboard");
        }catch{
            toast.error("Failed to copy Url");
        }
    }


    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Stripe Trigger Configuration </DialogTitle>
                    <DialogDescription>
                        Configure this webhook URL in your stripe Dashboard to trigger 
                        this workflow on payment events.
                    </DialogDescription> 
                </DialogHeader>
                <div className="spce-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            Webhook URL
                        </Label>
                        <div className="flex gap-2">
                            <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                            <Button type="button" size="icon" variant="outline" onClick={copyToClipboard}>
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2 ">
                        <h4 className="font-medium text-sm">Setup instruction</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 
                        list-decimal list-inside">
                            <li  >Open your Stripe Dashboard</li>
                            <li  >Go to Devlopers → Webhooks </li>
                            <li  >Copy "Add endpoint"</li>
                            <li  >Paste the webhook URL above</li>
                            <li  >Select events to listen for(e.g, payment_intent.succeeded) </li>
                            <li  >Save and copy the signing secret</li>
                        </ol>
                    </div>
                   
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Varaibles</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{Stripe.amount}}"}
                                </code>
                                -Payment amount
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{Stripe.currency}}"}
                                </code>
                                -Currency code
                            </li>
                            <li>
                                -And so on
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
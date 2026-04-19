"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import{
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Button } from "@/components/ui/button";


const formSchema = z.object({
    variableName : z.string()
                        .min(1 , {message :" Variable name is required "})
                         .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/ , { message : "Variable name must start with a letter or underscore and contains only letters, numbers and underscores" }),
    username:z.string().optional(),
    content:z.string().min(1,"Message content is requried").max(2000,"Discord messages cannot exceed 2000 characters"),
    webhookUrl:z.string().min(1,"webhook irl is required"),
});


export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
    open : boolean;    onOpenChange : ( open : boolean )=> void;
    onSubmit : (values : z.infer<typeof formSchema>)=>void;
    defaultValues?: Partial<DiscordFormValues>
}

export const DiscordDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={}
}: Props)=>{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues:{
            username : defaultValues.username || "",
            variableName : defaultValues.variableName || "",
            content : defaultValues.content || "",
            webhookUrl : defaultValues.webhookUrl || "",
        }
    });

    useEffect(()=>{
        if(open){
            form.reset({
                username : defaultValues.username || "",
                variableName : defaultValues.variableName || "",
                content : defaultValues.content || "",
                webhookUrl : defaultValues.webhookUrl || "",
            })
        }
    },[open , defaultValues ,form])


    const watchVariableName = form.watch("variableName") || "myDiscord";

    const handleSubmit = (values : z.infer<typeof formSchema>)=>{
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Discord webhook settings for this node.
                    </DialogDescription> 
                </DialogHeader>
                 <Form {...form}>
                    <form
                     onSubmit={form.handleSubmit(handleSubmit)}
                     className="space-y-8 mt-4"        
                    >
                        <FormField
                          control={form.control}
                          name="variableName"
                          render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Variable Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                     placeholder="myDiscord"
                                     {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Use this name to reference the result in other nodes:{" "}
                                    {`{{${watchVariableName}.text}}`}
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                          )}
                        />
                        <FormField 
                            control={form.control}
                            name="webhookUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Webhook Url</FormLabel>
                                    <FormControl>
                                        <Input 
                                         placeholder="https://discord.com/api/webhooks/..."
                                         {...field}
                                         />
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Discord : channel settings - Integrations - webhooks
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Message Content
                                </FormLabel>
                                <FormControl>
                                    <Textarea 
                                    placeholder="Summary {{aiResponse}}"
                                    className="min-h-[80px] font-mono text-sm"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The message to send. Use {"{ variables }"}
                                    for simple values or {"{ json variable }"} to 
                                    stringify onjects
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Bot Username (optional)</FormLabel>
                                    <FormControl>
                                        <Input 
                                         placeholder="Workflow Bot"
                                         {...field}
                                         />
                                    </FormControl>
                                    <FormDescription>
                                        Override the webhook's default username
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        <DialogFooter className="mt-4" >
                            <Button type="submit" >Save</Button>
                        </DialogFooter>
                    </form>
                 </Form>
            </DialogContent>
        </Dialog>
    )
}
import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { HttpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecuor } from "@/features/triggers/components/google-form-trigger/executor";
import { StripeTriggerExecuor } from "@/features/triggers/components/stripe-trigger/executor";
import { GeminiExecutor } from "../components/gemini/executor"; 
import { OpenAiExecutor } from "../components/openai/executor";
import { AnthropicExecutor } from "../components/anthropic/executor";
import { DiscordExecutor } from "../components/discord/executor";
import { SlackExecutor } from "../components/slack/executor";

export const executorRegistry : Record<NodeType, NodeExecutor> ={
    [NodeType.MANUAL_TRIGGER]:manualTriggerExecutor,
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : HttpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER] : googleFormTriggerExecuor,
    [NodeType.STRIPE_TRIGGER] : StripeTriggerExecuor,
    [NodeType.GEMINI] : GeminiExecutor,   
    [NodeType.ANTHROPIC] : AnthropicExecutor,  
    [NodeType.OPENAI] : OpenAiExecutor,  
    [NodeType.DISCORD] : DiscordExecutor,
    [NodeType.SLACK] : SlackExecutor
}

export const getExecutor = (type : NodeType) : NodeExecutor =>{
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }
     
 
    return executor
} 
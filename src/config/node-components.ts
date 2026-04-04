import type { NodeTypes } from "@xyflow/react"
import   { NodeType } from "@/generated/prisma/enums"
import { IntialNode } from "@/components/initil-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";


export const nodeComponents = {
    [ NodeType.INITIAL ] : IntialNode ,
    [ NodeType.HTTP_REQUEST ] : HttpRequestNode ,
    [ NodeType.MANUAL_TRIGGER ] : ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER] : GoogleFormTrigger
} as const satisfies NodeTypes

export type RegisterwdNodeType = keyof typeof nodeComponents;
import type { NodeTypes } from "@xyflow/react"
import   { NodeType } from "@/generated/prisma/enums"
import { IntialNode } from "@/components/initil-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";


export const nodeComponents = {
    [ NodeType.INITIAL ] : IntialNode ,
    [ NodeType.HTTP_REQUEST ] : HttpRequestNode ,
    [ NodeType.MANUAL_TRIGGER ] : ManualTriggerNode
} as const satisfies NodeTypes

export type RegisterwdNodeType = keyof typeof nodeComponents;
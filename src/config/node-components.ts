import type { NodeTypes } from "@xyflow/react"
import   { NodeType } from "@/generated/prisma/enums"
import { IntialNode } from "@/components/initil-node";


export const nodeComponents = {
    [ NodeType.INITIAL ] : IntialNode ,
} as const satisfies NodeTypes

export type RegisterwdNodeType = keyof typeof nodeComponents;
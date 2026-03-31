import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure  } from "@/trpc/init";
import { Node , Edge } from "@xyflow/react";
import {generateSlug} from "random-word-slugs"
import z from "zod";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ctx})=>{
        return prisma.worklow.create({
            data:{
                name:generateSlug(3),
                userId: ctx.auth.user.id,
                nodes:{
                    create:{
                        type:NodeType.INITIAL,
                        positon:{x:0,y:0},
                        name: NodeType.INITIAL
                    },
                }
            }
        })
    }),
    remove: protectedProcedure.input(z.object({id : z.string()})).mutation(({ctx , input })=>{
        return prisma.worklow.delete({
            where:{
                id :input.id,
                userId : ctx.auth.user.id
            }
        })
    }),
    updateName : protectedProcedure.input(z.object({ id:z.string() ,name: z.string().min(1)}))
    .mutation(( {ctx , input } )=>{
        return prisma.worklow.update({
            where:{
                id:input.id, 
                userId:ctx.auth.user.id
            },
            data:{
                name: input.name
            }
        })
    }),
    getOne : protectedProcedure.input(z.object({id : z.string()}))
    .query(async({ctx , input })=>{
        const workflow= await prisma.worklow.findFirstOrThrow({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            },
            include: { nodes :true ,connnections:true }
        });

        //transform server nodes to react0flow compatible nodes
        const nodes: Node[]= workflow.nodes.map((node) => ({
            id: node.id,
            type:node.type,
            position:node.positon as {x:number , y : number},
            data: (node.data as Record<string,unknown> ) || {},
        }))

        //transform server connection to react-flow compatible nodes
        const edges : Edge[]=workflow.connnections.map((connection) => ({
            id : connection.id,
            source : connection.fromNodeId,
            target : connection.toNodeId,
            sourceHandle : connection.fromOutput,
            targetHandle : connection.toInput,
        }));

        return {
            id: workflow.id,
            name : workflow.name,
            nodes,
            edges 
        }
    }),
    getMany : protectedProcedure
    .input(z.object({
        page:z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize:z.number()
                    .min(PAGINATION.MIN_PAGE_SIZE)
                    .max(PAGINATION.MAX_PAGE_SIZE)
                    .default(PAGINATION.DEFAULT_PAGE_SIZE),
                    search:z.string().default(""),
    }))
    .query(async ({ctx ,input })=>{
        const {page , pageSize ,search}=input;
        
        const [items ,totalCount]=await Promise.all([
            prisma.worklow.findMany({
                skip:(page-1)*pageSize,
                take:pageSize,
                where:{ userId:ctx.auth.user.id,
                    name:{
                        contains:search,
                        mode:"insensitive"
                    },
                },
                orderBy:{
                    updatedAt:"desc"
                }
            }),
            prisma.worklow.count({
                where:{ userId:ctx.auth.user.id,
                    name:{
                        contains:search,
                        mode:"insensitive"
                    }
                }
            })
        ]);
        const totalPages = Math.ceil(totalCount/pageSize);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    }),
})
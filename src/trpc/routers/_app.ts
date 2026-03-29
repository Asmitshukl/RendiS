import {  createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflows/server/routers';

export const appRouter = createTRPCRouter({
    worflows : workflowsRouter
});


export type AppRouter = typeof appRouter;


import { credentialsRouter } from '@/features/credentials/server/routers';
import {  createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflows/server/routers';

export const appRouter = createTRPCRouter({
    worflows : workflowsRouter,
    credentials : credentialsRouter
});


export type AppRouter = typeof appRouter;


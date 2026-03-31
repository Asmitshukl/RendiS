import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { Editorheader } from "@/features/editor/components/editor-header";
import { WorkflowList, WorkflowsContainer, WorkflowsError, WorkflowsLoading } from "@/features/workflows/components/worklows";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/servere";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps{
    params: Promise<{
        workflowId : string;
    }> 
}

const Page= async ({params} : PageProps)=>{
    await requireAuth();
    const {workflowId}=await params;
    prefetchWorkflow(workflowId);

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError/>}>
                <Suspense fallback={<EditorLoading/>}>
                    <Editorheader workflowId ={workflowId}/>
                    <main className="flex-1" >
                    <Editor workflowId={workflowId} />
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}

export default Page
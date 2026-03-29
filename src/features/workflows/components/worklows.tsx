"use client"
import { boolean } from "zod";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import React from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export const WorkflowList = () =>{
    const workflows = useSuspenseWorkflows(); 

    return (
        <div className="flex-1 flex justify-center items-center ">
            {JSON.stringify(workflows.data,null ,2)}
        </div>
    )
}

export const WorkflowsHeader = ({disabled} : { disabled?:boolean })=>{
    const createWorkflow = useCreateWorkflow();
    const {handleError , modal } = useUpgradeModal();  
    const router = useRouter();

    const handleCreate = ()=>{
        createWorkflow.mutate(undefined , {
            onSuccess:(data)=>{
                router.push(`/workflows/${data.id}`);
            },
            onError: (error)=>{
                handleError(error);
            }, 
        })
    }

    return (
        <>
        {modal}
        <EntityHeader
            title="Workflows"
            description="Create and manage your workflows"
            onNew={handleCreate}
            newButtonLabel="New Workflow"
            disabled={disabled}
            isCreating={createWorkflow.isPending}
         /> 
        </>
    );
}; 

export const WorkflowsContainer = ({children} : {children :React.ReactNode})=>{
    return (
        <EntityContainer 
          header={<WorkflowsHeader/>}
          search={<></>}
          pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}
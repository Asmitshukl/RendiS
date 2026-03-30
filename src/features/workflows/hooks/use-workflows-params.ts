import { useQueryStates } from "nuqs"
import { workflowsParams } from "../params"

export const useWorkFlowsParams = () => {
    return useQueryStates(workflowsParams)
}
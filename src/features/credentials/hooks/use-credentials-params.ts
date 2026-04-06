import { useQueryStates } from "nuqs"
import { credentialsParams } from "../params"

export const usecredentialsParams = () => {
    return useQueryStates(credentialsParams)
}
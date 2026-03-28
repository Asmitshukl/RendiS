import { requireAuth } from "@/lib/auth-utils"

const Page=async()=>{
    await requireAuth();
    return(
        <p>
            Worklows
        </p>
    )
}

export default Page
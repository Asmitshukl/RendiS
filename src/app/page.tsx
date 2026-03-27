
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/servere";
import { LogoutButton } from "./logout";

 const Page= async ()=>{
  await requireAuth();

  const data =await caller.getUsers();

  return (

    <div className={"text-red-500 min-h-screen min-w-screen flex items-center justify-center"}>
      protected server component
      {JSON.stringify(data)};
      <LogoutButton/>
    </div>
  )
}

export default Page; 
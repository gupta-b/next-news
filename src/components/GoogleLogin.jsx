"use client"

import { auth, signIn, signOut, handlers } from "@/auth"
 
export default async function SignIn() {
    try {
        // const session = await auth();
       
            return <button onClick={() => signIn("google")}>G-login</button>
    } catch (e) {
        console.log(e)
    }
}
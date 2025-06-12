"use client"

import { signIn, signOut, useSession } from "next-auth/react"
 
export default async function SignIn() {
    const { data, status } = useSession();
    console.log(data, status)
    if (status === "loading") {
        return (
        <button variant="outline" disabled>
            Loading...
        </button>
        )
    }
    try {
        // const session = await auth();
        if (!data) {
            return <button onClick={() => signIn("google")}>G-login</button>
        } 
        if (data) {
            console.log(data);
        }
    } catch (e) {
        console.log(e)
    }
}
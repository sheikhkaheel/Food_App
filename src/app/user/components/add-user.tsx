'use client'

import { ChangeEvent, useActionState, useState } from "react"
import { createUser } from "../actions"


export function AddUser(){
    
    const [name, setName] = useState("");

    const [error , action, isPending] = useActionState( async () => {
        const userId = await createUser(name)
        console.log(userId);
        localStorage.setItem('user-id',userId)
    } , null)


    return (
        <div>
            <form action={action}>
                <input className="text-black" type="name" placeholder="enter your name" value={name} onChange={(e:ChangeEvent<HTMLInputElement>)=> setName(e.target.value)}/>
                <button disabled={isPending} className="border">Save</button>
            </form>
        </div>
    )
}
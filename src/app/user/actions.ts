'use server'

import { userSchema } from "@/db/schema"
import { db } from "@/index"

export async function createUser(name: string){
    const id = await db.insert(userSchema).values({name:name}).returning({id:userSchema.id});
    console.log('user created');
    return id[0].id;
}
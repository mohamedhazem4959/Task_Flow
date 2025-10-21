import * as z from 'zod';

export const createSessionSchema = z.object({
    body: z.object({
        email: z.string("Email is required"),
        password: z.string("Password is required")
    })
})
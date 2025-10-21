import mongoose from "mongoose";
import * as z from "zod";


export const createTask = z.object({
    body: z.object({
        title: z.string("title is required"),
        status: z.enum(["completed", "working", "finished"]).optional(),
        description: z.string().optional(),
        project: z.string().optional()
    })
});

export const getSingleTaskValidation = z.object({
    params: z.object({
        taskId: z.string()
        .refine((id)=> mongoose.Types.ObjectId.isValid(id),{
            message: "Invalid task ID format"
        })
    })
})

export const updateAdminTask = z.object({
    body: z.object({
        title: z.string().optional(),
        status: z.string().optional(),
        description: z.string().optional(),
        memberEmail: z.string().optional()
    })
});

export const updateTaskStatus = z.object({
    body: z.object({
        status: z.string().optional()
    })
});
import * as z from 'zod';


export const createUserSchema = z.object({
    
  body: z.object({
    name: z.string("Name is required"),
    password: z.string("Password is required"),
    passwordConfirmation: z.string("Password confirmation is required"),
    role: z.string().optional(),
    email: z
    .string('Email is required')
    .email({error: 'Invalid email address'})
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["PasswordConfirmation"] // construct the error msg if the pssword does not match
  }),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
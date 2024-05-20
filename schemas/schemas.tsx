import {string, z} from 'zod'
export const userSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    phone: z.string().refine(value => /^\d{9,11}$/.test(value), {
        message: 'The phone must be a 9 to 11 digits'
    })
});

export const credentialsSchema= z.object({
    email: string().email(), 
    password: string(),
    user: string().uuid() 
})

export const credentialPutSchema= z.object({
    email: string().email(),
    lastpassword: string(), 
    password: string()
})


export const rolSchema= z.object({
    name: z.string(),
    description: z.string().optional(),
    state: z.boolean().optional()
})


export const rolUpdateSchema= z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    state: z.boolean().optional()
})

export const accountSchema= z.object({
    name: z.string(),
    lastname: z.string(),
    phone: z.string().refine(value => /^\d{9,11}$/.test(value), {
        message: 'The phone must be a 9 to 11 digits'
    }),
    email: string().email(),
    lastpassword: string().optional(),
    password: string()
})

export const authSchema= z.object({
    email: string().email(),
    password: string()
})
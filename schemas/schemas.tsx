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
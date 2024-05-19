import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { credentialsSchema, } from "../../../schemas/schemas";
import { modelCredentialSanitized } from "../../../utils/cleanModels";
import { hashPassword, comparePasswords } from "../../../hooks/cifrateHook";
import { rolUser } from "../../../hooks/foundData";

export async function GET() {
    try {
        const credentials = await prisma.credentials.findMany();

        const sanitizedcredentials = await Promise.all(
            credentials.map(async (credential) => {
                return await modelCredentialSanitized(credential);
            })
        );

        return NextResponse.json({
            message: "list of credentials",
            code: 200,
            data: sanitizedcredentials,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const body = await request.json()

    const result = credentialsSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const { email, password:pswOutCifrate, user } = result.data;
  
    const getUser =await prisma.user.findUnique({
        where:{external_id: user},
        include:{credentials:true}
    })

    if(!getUser) return NextResponse.json({
        message:"user not found", 
        code:404},{status:404})
    
    const existingCredentials = await prisma.credentials.findFirst({ where: { email } });
   
    if (existingCredentials && existingCredentials.external_id) {
        return NextResponse.json({ message: "Email already in use", code: 400 }, { status: 400 });
    }

    if (getUser.credentials) return NextResponse.json({message:"User already have account",code:400},{status:400})

    try {
        const password= await hashPassword(pswOutCifrate)

        let rol = await rolUser();

        const created = await prisma.credentials.create({
            data: {
                email,
                password,
                user_id:getUser.id,
                rol_id:rol.id
            }
        });

        if (!created) return NextResponse.json({ 
            message: "credential not created",
            code: 400 
        }, { status: 400 })

        const createdSanitized= await modelCredentialSanitized(created)

        return NextResponse.json({
            message: "credential created",
            code: 201,
            data: createdSanitized
        }, { status: 201 })


    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

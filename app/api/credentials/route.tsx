import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { credentialsSchema, } from "../../../schemas/schemas";
import { modelCredentialSanitized } from "../../../utils/cleanModels";

export async function GET() {
    try {
        const credentials = await prisma.credentials.findMany();

        const sanitizedcredentials = credentials.map(credential => {
            return modelCredentialSanitized(credential);
        });

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

    const { email, password, user } = result.data;
  
    const getUser =await prisma.user.findUnique({
        where:{external_id: user}
    })

    if(!getUser) return NextResponse.json({
        message:"user not found", 
        code:404},{status:404})
    
    try {
        const user_id=getUser.id
        
        const created = await prisma.credentials.create({
            data: {
                email,
                password,
                user_id
            }
        });

        if (!created) return NextResponse.json({ 
            message: "resource not created",
            code: 400 
        }, { status: 400 })

        const createdSanitized= modelCredentialSanitized(created)

        return NextResponse.json({
            message: "credential created",
            code: 201,
            data: createdSanitized
        }, { status: 201 })


    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

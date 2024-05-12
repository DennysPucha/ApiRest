import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { credentialPutSchema} from "../../../../schemas/schemas";
import { modelCredentialSanitized } from "../../../../utils/cleanModels";
interface Params { params: { external_id: string } }


export async function GET(request: Request, { params }: Params) {
    try {
        const credentials = await prisma.credentials.findFirst({ 
            where: { external_id: params.external_id }
        })

        if (!credentials) return NextResponse.json({ message: "credentials not found", code: 404 }, { status: 404 })
        
        const sanitizedcredentials= modelCredentialSanitized(credentials)
        
        return NextResponse.json({ 
            message: "ok! credentials obtained",
            code: 200,
            data: sanitizedcredentials}, { status: 200 })
    
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 },{ status: 500 })
    }
}


export async function PUT(request: Request, { params }: Params) {
    const body = await request.json()
    const result = credentialPutSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const credentials = await prisma.credentials.findFirst({ where: { external_id: params.external_id } })

    if (!credentials) return NextResponse.json({ message: "credentials not found", code: 404 }, { status: 404 })

    
    try {
        const { email, password, lastpassword} = result.data;

        if(credentials.password!==lastpassword) return NextResponse.json({ message: "credentials incorrects", code: 400 }, { status: 400 }) 

        const updated = await prisma.credentials.update({
            where: {
                external_id: credentials.external_id
            },
            data: {
                email,
                password
            },
        });

        if (!updated) return NextResponse.json({ 
            message: "resource not updated",
            code: 400 }, { status: 400 })

        delete updated.id

        return NextResponse.json({
            message: "credentials updated",
            code: 200,
            data: updated
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}


export async function DELETE(request: Request, { params }: Params) {
    const credentials = await prisma.credentials.findFirst({ where: { external_id: params.external_id } })

    if (!credentials) return NextResponse.json({ message: "credentials not found", code: 404 }, { status: 404 })

    try {
        const deleted = await prisma.credentials.delete({
            where: {
                external_id: credentials.external_id
            }
        })

        if (!deleted) return NextResponse.json({ 
            message: "resource not elimined",
            code:400}, { status: 400 })

        delete deleted.id

        return NextResponse.json({
            message: "credentials deleted",
            code: 200,
            data: deleted
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
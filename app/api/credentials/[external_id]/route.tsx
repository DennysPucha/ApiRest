import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { credentialPutSchema} from "../../../../schemas/schemas";
import { modelCredentialSanitized } from "../../../../utils/cleanModels";
import { comparePasswords,hashPassword } from "../../../../hooks/cifrateHook";
interface Params { params: { external_id: string } }


export async function GET(request: Request, { params }: Params) {
    try {
        const credentials = await prisma.credentials.findFirst({ 
            where: { external_id: params.external_id }
        })

        if (!credentials) return NextResponse.json({ message: "credential not found", code: 404 }, { status: 404 })
        
        const sanitizedcredentials= await modelCredentialSanitized(credentials)
        
        return NextResponse.json({ 
            message: "ok! credential obtained",
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

    if (!credentials) return NextResponse.json({ message: "credential not found", code: 404 }, { status: 404 })

    
    try {
        const { email, password:pswOutCifrate, lastpassword} = result.data;

        const credentialsCorrects=await comparePasswords(lastpassword,credentials.password)

        if(!credentialsCorrects) return NextResponse.json({ message: "credentials incorrects", code: 400 }, { status: 400 }) 
        
        const credentialsExist = await prisma.credentials.findFirst({ where: { email } });
        
        if (credentialsExist && credentialsExist.external_id !== credentials.external_id) {
            return NextResponse.json({ message: "Email already in use", code: 400 }, { status: 400 });
        }

        const password= await hashPassword(pswOutCifrate)

        const updated = await prisma.credentials.update({
            where: {
                external_id: credentials.external_id
            },
            data: {
                email,
                password,
                external_id: crypto.randomUUID()
            },
        });

        if (!updated) return NextResponse.json({ 
            message: "credential not updated",
            code: 400 }, { status: 400 })
        
        const updatedSanitized = await modelCredentialSanitized(updated)

        return NextResponse.json({
            message: "credential updated",
            code: 200,
            data: updatedSanitized
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
            message: "credential not elimined",
            code:400}, { status: 400 })

        const deletedSanitized = await  modelCredentialSanitized(deleted)

        return NextResponse.json({
            message: "credential deleted",
            code: 200,
            data: deletedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
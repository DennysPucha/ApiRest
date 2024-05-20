import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma";
import { accountSchema, deleteAccountSchema } from "../../../../../schemas/schemas";
import { modelUserCredentialSanitized } from "../../../../../utils/cleanModels";
import { rolUser } from "../../../../../hooks/foundData";
import { comparePasswords,hashPassword } from "../../../../../hooks/cifrateHook";

interface Params { params: { external_id: string } }
interface RequestQuery { foo:string}

// accounts model not exist in database alone is a relation visual in the endpoint with account and credentials
export async function GET(request: Request, { params }: Params) {
    
    try {
        const account = await prisma.user.findFirst({ 
            where: { external_id: params.external_id },
            include: {credentials:true}
        })

        if (!account) return NextResponse.json({ message: "account not found", code: 404 }, { status: 404 })
        
        const accountSanitized= await modelUserCredentialSanitized(account)

        return NextResponse.json({ 
            message: "ok! account obtained",
            code: 200,
            data: accountSanitized}, { status: 200 })
    
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 },{ status: 500 })
    }
}


export async function PUT(request: Request, { params }: Params) {
    const body = await request.json()
    const result = accountSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const account = await prisma.user.findFirst({ where: { external_id: params.external_id },include:{credentials:true}})

    if (!account) return NextResponse.json({ message: "account not found", code: 404 }, { status: 404 })

    
    try {
        const { phone, lastname, name, email, lastpassword, password:pswOutCifrate} = result.data;

        const credentialsExist = await prisma.credentials.findFirst({ where: { id: account.credentials.id} })

        if (!credentialsExist) return NextResponse.json({ message: "credentials not found", code: 404 }, { status: 404 })
        
        if(credentialsExist && credentialsExist.email!==account.credentials.email) return NextResponse.json({ message: "email already in use", code: 400 }, { status: 400 })

        const credentialsCorrects= await comparePasswords(lastpassword,credentialsExist.password)

        if(!credentialsCorrects) return NextResponse.json({ message: "credentials incorrects", code: 400 }, { status: 400 }) 

        const password= await hashPassword(pswOutCifrate)
        
        const updated = await prisma.user.update({
            where: {
                external_id: account.external_id
            },
            data: {
                name,
                lastname,
                phone,
                credentials:{
                    update:{
                        email,
                        password,
                        external_id: crypto.randomUUID()
                    }
                },
                external_id: crypto.randomUUID()
            },
            include:{
                credentials:true
            }
        });

        if (!updated) return NextResponse.json({ 
            message: "account not updated",
            code: 400 }, { status: 400 })

        const updatedSanitized= await modelUserCredentialSanitized(updated)

        return NextResponse.json({
            message: "account updated",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: Params) {
    const body = await request.json()
    const result = deleteAccountSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const account = await prisma.user.findFirst({ where: { external_id: params.external_id },include: {credentials:true} })

    if (!account) return NextResponse.json({ message: "account not found", code: 404 }, { status: 404 })

    try {

        const { email, password } = result.data;

        const credentialsExist = await prisma.credentials.findFirst({ where: { id: account.credentials.id} })

        if(!credentialsExist) return  NextResponse.json({ message: "credentials not found", code: 404 }, { status: 404 })
            
        const credentialsCorrects= await comparePasswords(password,credentialsExist.password)
 
        if(!credentialsCorrects || email!== credentialsExist.email) return NextResponse.json({ message: "credentials incorrects", code: 400 }, { status: 400 }) 

        const deleted = await prisma.user.delete({
            where: {external_id: account.external_id},
            include: {credentials:true}
        });

        if (!deleted) return NextResponse.json({ 
            message: "account not deleted",
            code: 400 }, { status: 400 })

        const updatedSanitized= await modelUserCredentialSanitized(deleted)

        return NextResponse.json({
            message: "account deleted",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
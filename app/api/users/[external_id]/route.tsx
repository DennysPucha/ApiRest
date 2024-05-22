import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { userPutSchema } from "../../../../schemas/schemas";
import { modelUserSanitized } from "../../../../utils/cleanModels";
interface Params { params: { external_id: string } }
interface RequestQuery { foo:string}

export async function GET(request: Request, { params }: Params) {
    
    try {
        const user = await prisma.user.findFirst({ where: { external_id: params.external_id }})

        if (!user) return NextResponse.json({ message: "user not found", code: 404 }, { status: 404 })
        
        const userSanitized= modelUserSanitized(user)

        return NextResponse.json({ 
            message: "ok! user obtained",
            code: 200,
            data: userSanitized}, { status: 200 })
    
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 },{ status: 500 })
    }
}


export async function PUT(request: Request, { params }: Params) {
    const body = await request.json()
    const result = userPutSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const userExist = await prisma.user.findFirst({ where: { external_id: params.external_id }})

    if (!userExist) return NextResponse.json({ message: "user not found", code: 404 }, { status: 404 })

    try {
        const { phone, lastname, name, state } = result.data;

        const updated = await prisma.user.update({
            where: {
                external_id: userExist.external_id
            },
            data: {
                name,
                lastname,
                phone,
                external_id: crypto.randomUUID(),
                state
            }
        });

        if (!updated) return NextResponse.json({ 
            message: "user not updated",
            code: 400 }, { status: 400 })

        const updatedSanitized= modelUserSanitized(updated)

        return NextResponse.json({
            message: "user updated",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: Params) {
  
    const userExist = await prisma.user.findFirst({ where: { external_id: params.external_id }})

    if (!userExist) return NextResponse.json({ message: "user not found", code: 404 }, { status: 404 })

    try {

        const disabled = await prisma.user.update({
            where: {external_id: userExist.external_id},
            data: { state: false }
        });

        if (!disabled) return NextResponse.json({ 
            message: "user not disabled",
            code: 400 }, { status: 400 })

        const updatedSanitized= modelUserSanitized(disabled)

        return NextResponse.json({
            message: "user disabled",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
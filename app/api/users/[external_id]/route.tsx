import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { userSchema } from "../../../../schemas/schemas";
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
    const result = userSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const user = await prisma.user.findFirst({ where: { external_id: params.external_id }})

    if (!user) return NextResponse.json({ message: "user not found", code: 404 }, { status: 404 })

    try {
        const { phone, lastname, name } = result.data;

        const updated = await prisma.user.update({
            where: {
                external_id: user.external_id
            },
            data: {
                name,
                lastname,
                phone,
                external_id: crypto.randomUUID()
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
  
    const user = await prisma.user.findFirst({ where: { external_id: params.external_id }})

    if (!user) return NextResponse.json({ message: "user not found", code: 404 }, { status: 404 })

    try {

        const deleted = await prisma.user.delete({
            where: {external_id: user.external_id}
        });

        if (!deleted) return NextResponse.json({ 
            message: "user not deleted",
            code: 400 }, { status: 400 })

        const updatedSanitized= modelUserSanitized(deleted)

        return NextResponse.json({
            message: "user deleted",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
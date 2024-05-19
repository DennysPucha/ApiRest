import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { rolSchema, rolUpdateSchema } from "../../../../schemas/schemas";
import { modelRolSanitized } from "../../../../utils/cleanModels";7

interface Params { params: { external_id: string } }
interface RequestQuery { foo:string}

export async function GET(request: Request, { params }: Params) {
    
    try {
        const rol = await prisma.rol.findFirst({ where: { external_id: params.external_id }})

        if (!rol) return NextResponse.json({ message: "rol not found", code: 404 }, { status: 404 })
        
        const rolSanitized= modelRolSanitized(rol)

        return NextResponse.json({ 
            message: "ok! rol obtained",
            code: 200,
            data: rolSanitized}, { status: 200 })
    
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 },{ status: 500 })
    }
}


export async function PUT(request: Request, { params }: Params) {
    const body = await request.json()
    const result = rolUpdateSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    const rol = await prisma.rol.findFirst({ where: { external_id: params.external_id }})

    if (!rol) return NextResponse.json({ message: "rol not found", code: 404 }, { status: 404 })

    try {
        const { name, description, state} = result.data;

        const rolExist = await prisma.rol.findFirst({ where: { name: name } })
        
        if(rolExist) return NextResponse.json({ message: "name already in use", code: 400 }, { status: 400 })

        const updated = await prisma.rol.update({
            where: {
                external_id: rol.external_id
            },
            data: {
                name:name,
                description,
                state,
                external_id: crypto.randomUUID()
            }
        });

        if (!updated) return NextResponse.json({ 
            message: "rol not updated",
            code: 400 }, { status: 400 })

        const updatedSanitized= modelRolSanitized(updated)

        return NextResponse.json({
            message: "rol updated",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: Params) {
  
    const rol = await prisma.rol.findFirst({ where: { external_id: params.external_id }})

    if (!rol) return NextResponse.json({ message: "rol not found", code: 404 }, { status: 404 })

    try {

        const deleted = await prisma.rol.delete({
            where: {external_id: rol.external_id}
        });

        if (!deleted) return NextResponse.json({ 
            message: "resource not deleted",
            code: 400 }, { status: 400 })

        const updatedSanitized= modelRolSanitized(deleted)

        return NextResponse.json({
            message: "rol deleted",
            code: 200,
            data: updatedSanitized
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
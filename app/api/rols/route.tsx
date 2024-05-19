import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { rolSchema } from "../../../schemas/schemas";
import { modelRolSanitized } from "../../../utils/cleanModels";

export async function GET() {
    try {
        const rols = await prisma.rol.findMany()

        const sanitizedrols = rols.map(rol => {
            return modelRolSanitized(rol)           
        });

        return NextResponse.json({
            message: "list of rols",
            code: 200,
            data: sanitizedrols,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const body = await request.json()
    const result = rolSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    try {
        const { name, description, state } = result.data;

        const rolExist = await prisma.rol.findFirst({ where: { name: name } })
        
        if(rolExist) return NextResponse.json({ message: "name already in use", code: 400 }, { status: 400 })

        const created = await prisma.rol.create({
            data: {
                name:name,
                description,
                state
            },
        });

        if (!created) return NextResponse.json({ 
            message: "resource not created",
            code: 400 
        }, { status: 400 })

        const credatedSanitized= modelRolSanitized(created)

        return NextResponse.json({
            message: "rol created",
            code: 201,
            data: credatedSanitized
        }, { status: 201 })


    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}


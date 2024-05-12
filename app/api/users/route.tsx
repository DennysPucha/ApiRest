import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { userSchema } from "../../../schemas/schemas";
import { modelUserCredentialSanitized , modelCredentialSanitized} from "../../../utils/cleanModels";
export async function GET() {
    try {
        const users = ((await prisma.user.findMany({
            include:{credentials:true}
        })))

        const sanitizedUsers = users.map(user => {
            return modelUserCredentialSanitized(user)            
        });

        return NextResponse.json({
            message: "list of users",
            code: 200,
            data: sanitizedUsers,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const body = await request.json()
    const result = userSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    try {
        const { phone, lastname, name } = result.data;

        const created = await prisma.user.create({
            data: {
                name,
                lastname,
                phone
            },
        });

        if (!created) return NextResponse.json({ 
            message: "resource not created",
            code: 400 
        }, { status: 400 })

        const credatedSanitized= modelUserCredentialSanitized(created)

        return NextResponse.json({
            message: "user created",
            code: 201,
            data: credatedSanitized
        }, { status: 201 })


    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}


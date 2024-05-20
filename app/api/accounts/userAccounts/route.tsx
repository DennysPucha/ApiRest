import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { accountSchema } from "../../../../schemas/schemas";
import { modelUserCredentialSanitized } from "../../../../utils/cleanModels";
import { rolUser } from "../../../../hooks/foundData";
import { hashPassword } from "../../../../hooks/cifrateHook";

// accounts model not exist in database alone is a relation visual in the endpoint with user and credentials

export async function GET() {
    try {
        const accounts = await prisma.user.findMany({
            include: {credentials:true}
        })

        const sanitizedaccounts = await Promise.all(accounts.map(account => {
            return modelUserCredentialSanitized(account)           
        }));

        return NextResponse.json({
            message: "list of accounts",
            code: 200,
            data: sanitizedaccounts,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const body = await request.json()
    const result = accountSchema.safeParse(body)

    if (!result.success) return NextResponse.json(result.error)

    try {
        const { phone, lastname, name, email, password:pswOutCifrate  } = result.data;

        const credentialsExist = await prisma.credentials.findFirst({ where: { email: email } })
        
        if(credentialsExist) return NextResponse.json({ message: "email already in use", code: 400 }, { status: 400 })

        let rol = await rolUser();

        const password= await hashPassword(pswOutCifrate)

        const created = await prisma.user.create({
            data: {
                name,
                lastname,
                phone,
                credentials:{
                    create:{
                        email,
                        password,
                        rol_id:rol.id
                    }
                }
            },
            include:{
                credentials:true
            }
        });


        if (!created) return NextResponse.json({ 
            message: "account not created",
            code: 400 
        }, { status: 400 })

        const credatedSanitized= await modelUserCredentialSanitized(created)

        return NextResponse.json({
            message: "account created",
            code: 201,
            data: credatedSanitized
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }
}
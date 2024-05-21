import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { hashPassword, comparePasswords } from '../../../hooks/cifrateHook';
import { prisma } from '../../../libs/prisma';
import { authSchema } from '../../../schemas/schemas';

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const result = authSchema.safeParse(body)

        if (!result.success) return NextResponse.json(result.error)

        const { email, password } = result.data;

        const credentialExist = await prisma.credentials.findFirst({ where: { email } })

        if (!credentialExist) return NextResponse.json({ message: "credentials not found", code: 404 }, { status: 404 })

        const credentialsCorrects = await comparePasswords(password, credentialExist.password)

        if (!credentialsCorrects || email !== credentialExist.email) return NextResponse.json({ message: "credentials incorrects", code: 400 }, { status: 400 })

        const rolExist= await prisma.rol.findFirst({where:{id:credentialExist.rol_id}})
        
        const token = jwt.sign(
            {
                email: credentialExist.email,
                rol: rolExist.name,
                external_id: credentialExist.external_id
            }, process.env.SECRET_KEY, { expiresIn: '2h' }
        )

        return NextResponse.json({ message: "ok! user logged", code: 200, token }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error, code: 500 }, { status: 500 })
    }


}
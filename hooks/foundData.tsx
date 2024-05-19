import { PrismaClient } from '@prisma/client'
export const rolUser = async ()=>{
    let rol =await prisma.rol.findFirst({where:{name:"user"}})
    if (!rol) rol= await prisma.rol.create({data:{name:"user"}})
    return rol
}
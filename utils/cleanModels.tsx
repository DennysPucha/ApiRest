import { userType, credentialType } from "../types/types"
import { prisma } from "../libs/prisma";
export const modelUserSanitized= ((model:userType)=>{ 
    delete model.id
    return model
})

export const modelCredentialSanitized=(async (model:credentialType) =>{
    const rol = await prisma.rol.findUnique({where:{id:model.rol_id}})
    if(rol) model.rol=rol.name

        delete model.rol_id
        delete model.id
        delete model.user_id

    return model
})

export const modelUserCredentialSanitized=((model:any)=>{
    delete model.id
    if(!model.credentials) model.credentials={}
    else{
        delete model.credentials.id
        delete model.credentials.user_id
    }
    return model
})

export const modelCredentialUserSanitized=((model:any)=>{
    delete model.id
    delete model.user_id
    delete model.user.id
    return model
})


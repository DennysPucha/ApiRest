import { userType, credentialType } from "../types/types"

export const modelUserSanitized= ((model:userType)=>{ 
    delete model.id
    return model
})

export const modelCredentialSanitized=((model:credentialType)=>{
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


export interface credentialType{
    id: number;
    email: string;
    password: string;
    state: boolean;
    user_id: number;
    rol_id: number;
    rol?: string;
    external_id: string;
}

export interface userType{
    id: number;
    name: string;
    lastname: string;
    phone: string;
    state: boolean
    external_id: string;
}

export interface userCredentialType {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    state: boolean;
    credentials?: {
        id: number;
        email: string;
        password: string;
        state: boolean;
        user_id: number;
        external_id: string;
    }|{};
    external_id: string;
}

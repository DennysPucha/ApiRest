import { toast } from 'sonner'
import { login } from '../../hooks/authHook';

export const LoginConst = async (subdata) => {
    const data={
        email: subdata.email,
        password: subdata.password
    }
    const response =await login(data);
    if (response.code==200 && response.token) {
        toast.success("Inicio de sesión exitoso")
    }else{
        toast.warning("Las credenciales ingresadas son incorrectas")
    }
}
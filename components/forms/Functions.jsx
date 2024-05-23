import { toast } from 'sonner'
import { login } from '../../hooks/authHook';
import { isSessionActive } from '../../hooks/sessionHooks';
export const LoginConst = async (subdata) => {
    const data={
        email: subdata.email,
        password: subdata.password
    }
    const response =await login(data);
    if (isSessionActive && response.code === 200) {
        toast.success("Inicio de sesión exitoso")
    }else{
        toast.warning("Las credenciales ingresadas son incorrectas")
    }
}
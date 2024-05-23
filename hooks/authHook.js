import { autentificar } from "./methods"
import {setItem} from "./sessionHooks"
export async function login(data) {
        const session = await autentificar(data);
        if (session.code === 200 && session.token) {
            setItem("token", session.token);
        }
        return session;
}
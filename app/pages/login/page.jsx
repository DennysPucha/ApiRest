"use client";
import {Input} from '../../../components/forms/Forms';
import Link from 'next/link';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoginConst} from '../../../components/forms/Functions';
import { Toaster} from 'sonner'

export default function Page() {

    const schema = yup.object().shape({
        email: yup.string().email("Ingrese un correo valido").required("El campo de correo electrónico es requerido"),
        password: yup.string().required("El campo de contraseña es requerido")
    });

    const {register, handleSubmit, formState: {errors}} = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => await LoginConst(data)

    return (
        <div>
            <Toaster />
            <div className="bg-gray-100 flex justify-center items-center h-screen">
                <div className="w-1/2 h-screen hidden lg:block">
                    <img src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat" alt="Placeholder Image" className="object-cover w-full h-full"></img>
                </div>
                <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold text-gray-600 mb-4">Inicio de sesión</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-600">Correo Electrónico</label>
                            <Input {...register("email")} type="text" id="email" />
                            <a className="text-red-500">{errors.email?.message}</a>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-600">Contraseña</label>
                            <Input {...register("password")} type="password" id="password" />
                            <a className="text-red-500">{errors.password?.message}</a>
                        </div>
                        
                        <div className="mb-6 text-blue-500">
                            <Link href="#" className="hover:underline">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
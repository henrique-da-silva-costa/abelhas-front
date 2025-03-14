import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../paginasUsuario/Login'
import CadastrarUsuario from '../paginasUsuario/CadastrarUsuario'
import NaoEncontrado from '../paginas/NaoEncontrado'
import VerificarEmail from '../paginasUsuario/VerificarEmail'
import RecuperarSenha from '../paginasUsuario/RecuperarSenha'

const LoginRotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastrar" element={<CadastrarUsuario />} />
                <Route path="/verificaremail" element={<VerificarEmail />} />
                <Route path="/recuperarsenha" element={<RecuperarSenha />} />
                <Route path="*" element={<NaoEncontrado />} />/
            </Routes>
        </BrowserRouter>
    )
}

export default LoginRotas
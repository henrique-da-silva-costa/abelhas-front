import React from 'react'
import Formulario from '../crud/Formulario'
import { Button, Container } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const nav = useNavigate();

    const inputs = {
        email: "",
        senha: ""
    }

    return (
        <Container>
            <h1 className="text-center">LOGIN</h1>
            <Formulario inputs={inputs} url={"login"} textoBotao={"LOGIN"} tipoformulario={"login"} />
            <div className="d-flex gap-2">
                <Button color="success" onClick={() => nav("/cadastrar")}>CADASTRE - SE</Button>
                <Button color="success" onClick={() => nav("/verificaremail")}>RECUPERAR SENHA</Button>
            </div>
        </Container>
    )
}

export default Login
import React from 'react'
import Formulario from '../crud/Formulario'
import { Container } from 'reactstrap'

const CadastrarUsuario = () => {
    const inputs = {
        nome: "",
        email: "",
        senha: ""
    }

    return (
        <Container>
            <h1 className="text-center">CADASTAR USUÁRIO</h1>
            <Formulario inputs={inputs} url={"usuario/cadastrar"} textoBotao={"CADASTRAR"} tipoformulario={"cadastroUsuario"} />
        </Container>

    )
}

export default CadastrarUsuario
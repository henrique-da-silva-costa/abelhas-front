import React from 'react'
import { Container } from 'reactstrap'
import Formulario from '../crud/Formulario'

const VerificarEmail = () => {
    return (
        <Container>
            <h1 className="text-center"></h1>
            <Formulario inputs={{ email: "" }} tipoformulario={"verificarEmail"} textoBotao={"VERIFICAR EMAIL"} url={"verificaremail"} />
        </Container>
    )
}

export default VerificarEmail
import React from 'react'
import { Container } from 'reactstrap'
import Formulario from '../crud/Formulario'
import styles from "../stilos.module.css"

const VerificarEmail = () => {
    return (
        <Container className={styles.formularioContainer}>
            <h1 className="text-center">VERIFICAR EMAIL</h1>
            <Formulario inputs={{ email: "" }} tipoformulario={"verificarEmail"} textoBotao={"VERIFICAR EMAIL"} url={"verificaremail"} />
        </Container>
    )
}

export default VerificarEmail
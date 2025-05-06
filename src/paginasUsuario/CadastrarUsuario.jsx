import React from 'react'
import Formulario from '../crud/Formulario'
import { Container } from 'reactstrap'
import styles from ".././stilos.module.css"

const CadastrarUsuario = () => {
    const inputs = {
        img: "",
        nome: "",
        email: "",
        senha: ""
    }

    return (
        <Container className={styles.formularioContainer}>
            <h1 className="text-center">CADASTAR USUÁRIO</h1>
            <Formulario inputs={inputs} url={"usuario/cadastrar"} textoBotao={"CADASTRAR"} tipoformulario={"cadastroUsuario"} />
        </Container>

    )
}

export default CadastrarUsuario
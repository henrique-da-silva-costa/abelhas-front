import React from 'react'
import Formulario from '../crud/Formulario'
import { Button, Container } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import styles from ".././stilos.module.css"

const Login = () => {
    const nav = useNavigate();

    const inputs = {
        email: "",
        senha: ""
    }

    return (
        <Container className={styles.formularioContainer}>
            <h1 className="text-center">LOGIN</h1>
            <Formulario inputs={inputs} url={"login"} corBotao={"primary"} textoBotao={"LOGIN"} tipoformulario={"login"} />
            <div className="d-flex gap-2">
                <Button className={styles.fonteBotao12} color="success" onClick={() => nav("/cadastrar")}>CADASTRE - SE</Button>
                <Button className={styles.fonteBotao12} color="secondary" onClick={() => nav("/verificaremail")}>RECUPERAR SENHA</Button>
            </div>
        </Container>
    )
}

export default Login
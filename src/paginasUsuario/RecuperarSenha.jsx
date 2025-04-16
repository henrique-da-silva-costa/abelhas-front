import React, { useEffect } from 'react'
import { Container } from 'reactstrap'
import Formulario from '../crud/Formulario'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "../stilos.module.css";

const RecuperarSenha = () => {

    const nav = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("email").length < 1) {
            nav("/verificaremail")
        }
    }, []);

    const inputs = {
        email: localStorage.getItem("email"),
        senha: "",
        novaSenha: "",
        confirmaSenha: "",
    }

    return (
        <Container className={styles.formularioContainer}>
            <h1 className="text-center">Recuperar senha</h1>
            <Formulario inputs={inputs} textoBotao={"RECUPERAR SENHA"} url={"recuperarsenha"} tipoformulario={"recuperarSenha"} />
        </Container>
    )
}

export default RecuperarSenha
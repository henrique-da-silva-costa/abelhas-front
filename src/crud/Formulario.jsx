import React, { useContext, useState } from 'react'
import { Button, FormGroup, Input, Label } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '../contexts/Usuario';

const Formulario = ({ inputs = {}, url, textoBotao, tipoformulario }) => {
    const [formulario, setformularuio] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState(textoBotao);
    const nav = useNavigate();
    const { setAuth } = useContext(Usuario)

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        setformularuio({
            ...formulario, [name]: value
        })
    }

    const enviar = (e) => {
        e.preventDefault();
        setMsg("");
        axios.post(`http://localhost:8000/${url}`, formulario, {
            withCredentials: true,
            headers: {
                "X-CSRF-TOKEN": localStorage.getItem("token")
            }
        }).then(res => {
            if (res.data.erro) {
                setMsg(res.data.msg)
            }

            if (!res.data.erro && tipoformulario === "login") {
                console.log(res.data.usuario);

                sessionStorage.setItem("usuario", JSON.stringify(res.data.usuario));
                setAuth(true);
            }

            if (!res.data.erro && tipoformulario === "cadastroUsuario") {
                nav("/");
            }

            if (!res.data.erro && tipoformulario === "verificarEmail") {
                localStorage.setItem("email", formulario.email);
                nav("/recuperarsenha");
            }

            if (!res.data.erro && tipoformulario === "recuperarSenha") {
                nav("/");
            }

        }).catch(error => {
            console.error(error.response.data);
        });
    }

    const tipoInput = (tipo) => {
        const tiposData = ["data_criacao", "data_alteracao", "data_divisao"];

        if (tipoformulario === "recuperarSenha" && tipo == "email") {
            return "hidden"
        }

        if (tipo == "usuario_id") {
            return "hidden";
        }

        if (tiposData.includes(tipo)) {
            return "date";
        }
    }

    const tipoLabel = (tipo) => {

        if (tipoformulario === "recuperarSenha" && tipo == "email") {
            return ""
        }

        if (tipo == "usuario_id") {
            return ""
        }

        return tipo;
    }

    return (
        <div>
            <form onSubmit={enviar}>
                <FormGroup>
                    {formulario ? Object.keys(formulario).map((valor, index) => {
                        return (
                            <div key={index}>
                                <div className="">
                                    <Label htmlFor={valor} className={styles.labels}>{tipoLabel(valor)}</Label>
                                    <Input placeholder={valor} type={tipoInput(valor)} disabled={desabilitar} name={valor} onChange={changeformulario} />
                                    <p className={styles.erro}>{erro[valor]}</p>
                                </div>
                            </div>
                        )
                    }) : ""}
                </FormGroup>
                <span className={styles.erro}>{msg}</span>
                <div className="d-flex gap-2 justify-content-end">
                    <Button color="success" disabled={desabilitar}>{textoBotaoCarregando}</Button>
                </div>
            </form>

        </div>
    )
}

export default Formulario
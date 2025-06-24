import React, { useContext, useState } from 'react'
import { Button, FormGroup, Input, Label } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '../contexts/Usuario';

const Formulario = ({ inputs = {}, url, textoBotao, tipoformulario, corBotao = "success" }) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState(textoBotao);
    const nav = useNavigate();
    const { setAuth } = useContext(Usuario)

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        setFormulario({
            ...formulario, [name]: name === "img" ? files[0] : value
        });
    }

    const enviar = (e) => {
        e.preventDefault();
        setMsg("");
        const msgerros = {};

        setErro(msgerros);
        setDesabilitar(true);
        setTextoBotaoCarregando("CAREGANDO...")

        axios.get("https://abelhas.shop/token", { withCredentials: true })
            .then(response => {
                axios.post(`https://abelhas.shop/${url}`, formulario, {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": response.data.token,
                        "Content-Type": "multipart/form-data"
                    }
                }).then(res => {
                    for (const [key, value] of Object.entries(formulario)) {
                        if (value != null && value.length == 0) {
                            msgerros[key] = "Campo obrigatório";
                        }

                        if (value != null && value.length > 255) {
                            msgerros[key] = `O campo ${key} dever ter no maximo 255 caracteres`;
                        }

                        if (res.data.campo) {
                            msgerros[res.data.campo] = res.data.msg;
                        }

                        if (res.data.erro) {
                            setMsgCor(styles.erro);
                            setMsg(res.data.msg);
                            setDesabilitar(false);
                            setTextoBotaoCarregando(textoBotao)
                        }

                        if (res.data.campo) {
                            setMsg("");
                        }

                        setErro(msgerros);
                    }

                    if (!res.data.erro && tipoformulario === "login") {
                        sessionStorage.setItem("usuario", JSON.stringify(res.data.usuario));
                        setAuth(true);
                    }

                    if (!res.data.erro && tipoformulario === "cadastroUsuario") {
                        nav("/");
                        setMsgCor(styles.sucesso);
                        setTimeout(() => {
                            setDesabilitar(false);
                        }, 1200);
                        setTextoBotaoCarregando(textoBotao)
                    }

                    if (!res.data.erro && tipoformulario === "verificarEmail") {
                        localStorage.setItem("email", formulario.email);
                        nav("/recuperarsenha");
                        setMsgCor(styles.sucesso);
                        setTimeout(() => {
                            setDesabilitar(false);
                        }, 1200);
                        setTextoBotaoCarregando(textoBotao)
                    }

                    if (!res.data.erro && tipoformulario === "recuperarSenha") {
                        nav("/");
                        setMsgCor(styles.sucesso);
                        setTimeout(() => {
                            setDesabilitar(false);
                        }, 1200);
                        setTextoBotaoCarregando(textoBotao)
                    }
                }).catch(error => {
                    for (const [key, value] of Object.entries(formulario)) {
                        if (!error.response) {
                            setMsg("Erro interno no servidor, contate o suporte")
                            setTextoBotaoCarregando(textoBotao);
                            setDesabilitar(false);
                            setErro("");
                            return;
                        }

                        if (value != null && value.length == 0) {
                            msgerros[key] = "Campo obrigatório";
                        }

                        else if (key === "email" && !/\S+@\S+\.\S+/.test(value)) {
                            msgerros[key] = "O e-mail deve ser válido.";
                        }


                        setErro(msgerros);
                    }

                    if (!error.response) {
                        setMsg("Erro interno no servidor, contate o suporte")
                        setErro("");
                    }

                    setTextoBotaoCarregando(textoBotao);
                    setDesabilitar(false);
                });
            })
            .catch(error => {
                if (!error.response) {
                    setMsg("Erro interno no servidor, contate o suporte")
                    setErro("");
                }

                setMsgCor(styles.erro);
                setTextoBotaoCarregando(textoBotao);
                setDesabilitar(false);
            });
    }

    const tipoInput = (tipo) => {
        const tiposData = ["data_criacao", "data_alteracao", "data_divisao"];
        const tiposSenha = ["senha", "novaSenha", "confirmaSenha"];

        if (tiposSenha.includes(tipo)) {
            return "password";
        }

        if (tipoformulario === "recuperarSenha" && tipo == "email") {
            return "hidden"
        }

        if (tipo == "usuario_id") {
            return "hidden";
        }

        if (tipo == "img") {
            return "file";
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
            {formulario.img ? <img src={URL.createObjectURL(formulario.img)} alt="" height={100} width={100} /> : ""}
            <form onSubmit={enviar}>
                <FormGroup>
                    {formulario ? Object.keys(formulario).map((valor, index) => {
                        return (
                            <div key={index}>
                                <div className="">
                                    <Label htmlFor={valor} className={styles.labels}><strong>{tipoLabel(valor)}</strong></Label>
                                    <Input placeholder={valor} type={tipoInput(valor)} disabled={desabilitar} name={valor} onChange={changeformulario} />
                                    <p className={styles.erro}>{erro[valor]}</p>
                                </div>
                            </div>
                        )
                    }) : ""}
                </FormGroup>
                <span className={msgCor}>{msg}</span>
                <div className="d-flex gap-2 justify-content-end">
                    <Button color={corBotao} disabled={desabilitar}>{textoBotaoCarregando}</Button>
                </div>
            </form>

        </div>
    )
}

export default Formulario
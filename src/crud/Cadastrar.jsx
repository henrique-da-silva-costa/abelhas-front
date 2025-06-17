import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';
import { IoAdd } from 'react-icons/io5';
import { inputInvisivelEDivisaoColunas, tipoLabel } from './validacoesFormulario';

const Cadastrar = ({
    inputs = {},
    pegarDadosCarregar = () => { },
    url,
    generos = [],
    colmeiasMatrizes = [],
    status = [],
    tamanhoModal = "",
    formularioNome = ""
}) => {
    const usuarioId = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).id : "";
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [desabilitarEspecie, setDesabilitarEspecie] = useState(true);
    const [especies, setEspecies] = useState([]);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("CADASTRAR");
    const [temMatriz, setTemMatriz] = useState(true);
    const [temDoadora, setTemDoadora] = useState(true);
    const [modal, setModal] = useState(false);
    const [tipoDivisao, setTipoDivisao] = useState([]);
    const [doadoraDisco, setDoadoraDisco] = useState([]);
    const [doadoraCampeira, setDoadoraCampeira] = useState([]);
    const [imglocalNome, setImglocalNome] = useState("");
    const [generoSelect, setGeneroSelect] = useState("");

    const toggle = () => {
        setModal(!modal)
        setMsg("");
        setFormulario(inputs);
        setErro({});
    };

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImglocalNome(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }

        if (name == "genero_id" && value > 0) {
            axios.get("http://localhost:8000/especies", { params: { genero_id: value } }).then((res) => {
                setEspecies(res.data)
                setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })
        }

        if (name == "especie_id") {
            axios.get("http://localhost:8000/doadoras/disco/select", {
                params: {
                    usuario_id: usuarioId,
                    especie_id: value
                }
            }).then((res) => {
                setDoadoraDisco(res.data)
                // setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })

            axios.get("http://localhost:8000/doadoras/campeira/select", {
                params: {
                    usuario_id: usuarioId,
                    especie_id: value
                }
            }).then((res) => {
                setDoadoraCampeira(res.data)
                // setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })
        }

        axios.get("http://localhost:8000/colmeias/tipodivisoes").then((res) => {
            setTipoDivisao(res.data)
        }).catch((err) => {
            console.error(err);
        })

        if (name == "status_id") {
            if (value == 1) {
                setTemMatriz(false);
            } else {
                setTemMatriz(true);
            }
        }

        setFormulario({
            ...formulario, [name]: name == "img" ? files[0] : value
        });

    }

    const enviar = (e) => {
        e.preventDefault();
        const msgerros = {};
        formulario["genero_select"] = generoSelect;

        const camposLivres = ["doadora_campeira_id", "doadora_disco_id"];

        setErro(msgerros);
        setDesabilitar(true);
        setTextoBotaoCarregando("CAREGANDO...")

        axios.get("http://localhost:8000/token", { withCredentials: true })
            .then(response => {
                axios.post(`http://localhost:8000/${url}`, formulario, {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": response.data.token,
                        "Content-Type": "multipart/form-data"
                    }
                }).then(res => {
                    for (const [key, value] of Object.entries(formulario)) {
                        if (!camposLivres.includes(key) && value != null && value.length == 0) {
                            msgerros[key] = "Campo obrigatório";
                        }

                        if (value != null && value.length > 255) {
                            msgerros[key] = `O campo ${key} dever ter no maximo 255 caracteres`;
                        }

                        if (res.data.campo) {
                            msgerros[res.data.campo] = res.data.msg;
                        }

                        if (res.data.erro) {
                            setModal(true);
                            setMsgCor(styles.erro);
                            setMsg(res.data.msg);
                            setDesabilitar(false);
                            setTextoBotaoCarregando("CADASTRAR")
                        }

                        if (res.data.campo) {
                            setMsg("");
                        }

                        setErro(msgerros);
                    }

                    if (!res.data.erro) {
                        pegarDadosCarregar();
                        setMsgCor(styles.sucesso);
                        setMsg("Cadastro realizado com sucesso");
                        setTimeout(() => {
                            setModal(false)
                            setDesabilitar(false);
                        }, 1200);
                        setTextoBotaoCarregando("CADASTRAR")
                    }
                }).catch(error => {
                    for (const [key, value] of Object.entries(formulario)) {
                        if (!error.response) {
                            setMsg("Erro interno no servidor, contate o suporte")
                            setTextoBotaoCarregando("CADASTRAR");
                            setDesabilitar(false);
                            setErro("");
                            return;
                        }

                        if (!camposLivres.includes(key) && value != null && value.length == 0) {
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

                    setTextoBotaoCarregando("CADASTRAR");
                    setDesabilitar(false);
                    setModal(true);
                });
            })
            .catch(error => {
                console.error(error);
            });


    }

    const tipoValorInput = (tipo) => {
        const tiposData = ["data_criacao", "data_alteracao", "data_divisao"];

        if (tiposData.includes(tipo)) {
            return "date";
        }

        if (tipo == "usuario_id") {
            return "hidden";
        }

        if (tipo == "genero_select") {
            return "hidden";
        }

        if (tipo == "img") {
            return "file";
        }

        if (tipo == "descricao") {
            return "textarea";
        }

        if (tipo === "doadora_disco_id" || tipo === "doadora_campeira_id" || tipo === "tipo_divisao_id") {
            if (!temMatriz) {
                return "text"
            }

            return "hidden"
        }

        if (tipo == "tipo_doacao_id") {
            return "hidden";
        }
    }

    const tipoInput = (tipo) => {
        if (tipo == "doadora_disco_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" value={formulario.genero} >
                    <option value={""}>Selecione...</option>
                    {
                        doadoraDisco.length > 0 ? doadoraDisco.map((disco, index) => {
                            return (
                                <option key={index} value={disco.id}>{disco.colmeia_nome}</option>
                            )
                        }) : <option value={""}>Sem resultados</option>
                    }
                </select>
            </>
        }

        if (tipo == "doadora_campeira_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" value={formulario.genero} >
                    <option value={""}>Selecione...</option>
                    {
                        doadoraCampeira.length > 0 ? doadoraCampeira.map((campeira, index) => {
                            return (
                                <option key={index} value={campeira.id}>{campeira.colmeia_nome}</option>
                            )
                        }) : <option value={""}>Sem resultados</option>
                    }
                </select>
            </>
        }
        if (tipo == "tipo_divisao_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" value={formulario.genero} >
                    <option value={""}>Selecione...</option>
                    {
                        tipoDivisao.length > 0 ? tipoDivisao.map((tipo, index) => {
                            return (
                                <option key={index} value={tipo.id}>{tipo.tipo}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }
        if (tipo == "colmeia_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" value={formulario.genero} >
                    <option value={""}>Selecione...</option>
                    {
                        colmeiasMatrizes.length > 0 ? colmeiasMatrizes.map((colmeiaMatriz, index) => {
                            return (
                                <option key={index} value={colmeiaMatriz.id}>{colmeiaMatriz.nome}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }
        if (tipo == "genero_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" value={formulario.genero} >
                    <option value={""}>Selecione...</option>
                    {
                        generos.length > 0 ? generos.map((genero, index) => {
                            return (
                                <option key={index} value={genero.id}>{genero.genero}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }

        if (tipo == "especie_id") {
            return <>
                <select name={tipo} disabled={desabilitarEspecie} onChange={changeformulario} className="form-control" value={formulario.especie} >
                    <option value={""}>Selecione...</option>
                    {
                        especies.length > 0 ? especies.map((especie, index) => {
                            return (
                                <option key={index} value={especie.id}>{especie.especie}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }

        if (tipo == "status_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" value={formulario.status} >
                    <option value={""}>Selecione...</option>
                    {
                        status.length > 0 ? status.map((statu, index) => {
                            return (
                                <option key={index} value={statu.id}>{statu.status}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }

        if (tipo == "img") {
            return <Input accept="image/*" placeholder={tipo} type={tipoValorInput(tipo)} disabled={desabilitar} name={tipo} onChange={changeformulario} />
        }


        return <Input placeholder={tipo} type={tipoValorInput(tipo)} disabled={desabilitar} name={tipo} onChange={changeformulario} />
    }


    return (

        <div >
            <Button color="transparent" className="border border-0" onClick={toggle}>
                <strong className="text-success">CADASTRAR</strong> <IoAdd color="green" fontSize={40} />
            </Button>
            <Modal backdrop="static" size={tamanhoModal} isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>CADASTRAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {imglocalNome && (
                                <div>
                                    <h3>Pré-visualização:</h3>
                                    <img
                                        src={imglocalNome}
                                        alt="Pré-visualização"
                                        style={{ maxWidth: '100%', height: '100px' }}
                                    />
                                </div>
                            )}
                            <div className="row">

                                {formulario ? Object.keys(formulario).map((valor, index) => {
                                    return (
                                        <div key={index} className={inputInvisivelEDivisaoColunas(valor, temMatriz, formularioNome)}>
                                            <Label htmlFor={valor} className={styles.labels}><strong>{tipoLabel(valor, temMatriz)}</strong></Label>
                                            {tipoInput(valor)}
                                            <p className={styles.erro}>{erro[valor]}</p>
                                        </div>
                                    )
                                }) : ""}
                            </div>
                        </FormGroup>
                        <span className={msgCor}>{msg}</span>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button color="danger" disabled={desabilitar} onClick={() => setModal(false)}>FECHAR</Button>
                            <Button color="success" disabled={desabilitar}>{textoBotaoCarregando}</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

        </ div>
    )
}

export default Cadastrar
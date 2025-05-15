import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import { inputInvisivelEDivisaoColunas, tipoLabel } from './validacoesFormulario';

const Editar = ({
    inputs = {},
    pegarDadosCarregar = () => { },
    url,
    urlGet,
    colmeiasMatrizes = [],
    tiposDoacao = [],
    generos = [],
    status = [],
    tamanhoModal = "",
    formularioNome = "" }) => {
    const usuarioId = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).id : "";
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [msgCor, setMsgCor] = useState("");
    const [especies, setEspecies] = useState([]);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("EDITAR");
    const [temMatriz, setTemMatriz] = useState(false);
    const [modal, setModal] = useState(false);
    const [tipoDivisao, setTipoDivisao] = useState([]);
    const [doadoraDisco, setDoadoraDisco] = useState([]);
    const [doadoraCampeira, setDoadoraCampeira] = useState([]);
    const [imglocalNome, setImglocalNome] = useState("");

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
            ...formulario, [name]: name === "img" ? files[0] : value
        })
    }

    const pegardados = () => {
        axios.get(`http://localhost:8000/${urlGet}`).then((res) => {
            setFormulario(res.data)

            axios.get("http://localhost:8000/doadoras/campeira/select", { params: { usuario_id: usuarioId } }).then((res) => {
                setDoadoraCampeira(res.data)
                // setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })

            axios.get("http://localhost:8000/doadoras/disco/select", { params: { usuario_id: usuarioId } }).then((res) => {
                setDoadoraDisco(res.data)
                // setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })

            axios.get("http://localhost:8000/colmeias/tipodivisoes").then((res) => {
                setTipoDivisao(res.data)
                // setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })

            if (res.data.status_id == 2) {
                setTemMatriz(true);
            } else {
                setTemMatriz(false)
            }

            axios.get("http://localhost:8000/especies", { params: { genero_id: res.data.genero_id } }).then((res) => {
                setEspecies(res.data)
            }).catch((err) => {
                console.error(err);
            })
        }).catch((err) => {
            console.log(err);
        })
    };

    const toggle = () => {
        setModal(!modal)
        pegardados();
        setMsg("");
    };

    const enviar = (e) => {
        e.preventDefault();

        const msgerros = {};

        function jsonToFormData(json) {
            const formData = new FormData();

            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    // Se o valor for um objeto (como File), adiciona diretamente
                    // Caso contrário, converte para string
                    if (json[key] instanceof File || json[key] instanceof Blob) {
                        formData.append(key, json[key]);
                    } else if (typeof json[key] === 'object') {
                        // Para objetos aninhados, você pode converter para JSON string
                        formData.append(key, JSON.stringify(json[key]));
                    } else {
                        formData.append(key, json[key]);
                    }
                }
            }

            return formData;
        }

        const formData = jsonToFormData(formulario);

        // Para verificar o conteúdo (apenas para debug)
        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        console.log(formData);


        setErro(msgerros);
        setDesabilitar(true);
        setTextoBotaoCarregando("CAREGANDO...")

        axios.get("http://localhost:8000/token", { withCredentials: true })
            .then(response => {
                axios.put(`http://localhost:8000/${url}`, formData, {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": response.data.token,
                        // "Content-Type": "application/json",
                        "Content-Type": "multipart/form-data",
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

                        if (res.data.campo == "status_id") {
                            msgerros["status_id"] = res.data.msg;
                        }

                        if (res.data.erro) {
                            setModal(true);
                            setMsgCor(styles.erro);
                            setMsg(res.data.msg);
                            setDesabilitar(false);
                            setTextoBotaoCarregando("EDITAR")
                        }

                        if (res.data.campo) {
                            setMsg("");
                        }

                        setErro(msgerros);
                    }

                    if (!res.data.erro) {
                        pegarDadosCarregar();
                        setMsgCor(styles.sucesso);
                        setMsg("edicao realizado com sucesso");
                        setTimeout(() => {
                            setModal(false)
                            setDesabilitar(false);
                        }, 1200);
                        setTextoBotaoCarregando("EDITAR")
                    }
                }).catch(error => {
                    for (const [key, value] of Object.entries(formulario)) {
                        if (!error.response) {
                            setTextoBotaoCarregando("EDITAR");
                            setDesabilitar(false);
                            setErro("");
                            return;
                        }

                        if (response.data.campo) {
                            msgerros[response.data.campo] = response.data.msg;
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

                    setTextoBotaoCarregando("EDITAR");
                    setDesabilitar(false);
                    setModal(true);
                });
            })
            .catch(error => {
                console.log(error.response.data);
            });
    }

    const tipoValorInput = (tipo) => {
        const tiposData = ["data_criacao", "data_alteracao", "data_divisao"];

        if (tiposData.includes(tipo)) {
            return "date";
        }

        if (tipo == "img") {
            return "file";
        }

        if (tipo == "descricao") {
            return "textarea";
        }

        if (tipo == "img_caminho") {
            return "hidden";
        }

        if (tipo == "usuario_id") {
            return "hidden";
        }

        if (tipo == "id") {
            return "hidden";
        }

        if (tipo == "tipo_doacao_id") {
            return "hidden";
        }
    }

    const tipoInput = (tipo) => {
        if (tipo == "doadora_disco_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.doadora_disco_id} >
                    <option value={""}>Selecione...</option>
                    {
                        doadoraDisco.length > 0 ? doadoraDisco.map((disco, index) => {
                            return (
                                <option key={index} value={disco.id}>{disco.colmeia_nome}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }
        if (tipo == "doadora_campeira_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.doadora_campeira_id} >
                    <option value={""}>Selecione...</option>
                    {
                        doadoraCampeira.length > 0 ? doadoraCampeira.map((campeira, index) => {
                            return (
                                <option key={index} value={campeira.id}>{campeira.colmeia_nome}</option>
                            )
                        }) : ""
                    }
                </select>
            </>
        }
        if (tipo == "tipo_divisao_id") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.tipo_divisao_id} >
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
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.genero} >
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
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.genero} >
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
                <select name={tipo} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.especie_id} >
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
                <select name={tipo} disabled={desabilitar} onChange={changeformulario} className="form-control" defaultValue={formulario[tipo]} value={formulario.stauts_id} >
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
            return <Input accept="image/*" placeholder={tipo} value={formulario.tipo} type={tipoValorInput(tipo)} disabled={desabilitar} name={tipo} onChange={changeformulario} />
        }

        return <Input placeholder={tipo} defaultValue={formulario[tipo]} type={tipoValorInput(tipo)} disabled={desabilitar} name={tipo} onChange={changeformulario} />
    }

    return (
        <div>
            <Button color="transparent" className="border border-0" onClick={toggle}>
                <MdEdit color="blue" fontSize={28} />
            </Button>
            <Modal backdrop="static" size={tamanhoModal} isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EDITAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {imglocalNome && (
                                <div>
                                    <h3>Pré-visualização:</h3>
                                    <img
                                        src={!imglocalNome ? formulario.img : imglocalNome}
                                        alt="Pré-visualização"
                                        style={{ maxWidth: '100%', height: '100px' }}
                                    />
                                </div>
                            )}
                            <div className="row">
                                {formulario ? Object.keys(formulario).map((valor, index) => {
                                    return (
                                        <div key={index} className={inputInvisivelEDivisaoColunas(valor, temMatriz, formularioNome)}>
                                            <Label htmlFor={valor} className={styles.labels}><strong>{tipoLabel(valor)}</strong></Label>
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

        </div>
    )
}

export default Editar
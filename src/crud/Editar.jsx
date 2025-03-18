import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';

const Editar = ({ inputs = {}, url, urlGet, generos = [], status = [] }) => {
    const usuarioId = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).id : "";
    const [formulario, setformularuio] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    // const [desabilitarEspecie, setDesabilitarEspecie] = useState(true);
    const [especies, setEspecies] = useState([]);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("EDITAR");
    const [modal, setModal] = useState(false);

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        console.log(formulario)

        if (name == "genero_id" && value > 0) {
            axios.get("http://localhost:8000/especies", { params: { genero_id: value } }).then((res) => {
                setEspecies(res.data)
            }).catch((err) => {
                console.error(err);
            })
        }

        setformularuio({
            ...formulario, [name]: value
        })
    }

    const pegardados = () => {
        axios.get(`http://localhost:8000/${urlGet}`).then((res) => {
            setformularuio(res.data)
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
    };

    const enviar = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/${url}`, formulario, {
            withCredentials: true,
            headers: {
                "X-CSRF-TOKEN": localStorage.getItem("token")
            }
        }).then(res => {
            console.log(res.data);
        }).catch(error => {
            console.error(error.response.data);
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
    }

    const tipoLabel = (tipo) => {
        if (tipo == "usuario_id") {
            return ""
        }

        return tipo;
    }

    const tipoInput = (tipo) => {
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
                <p className={styles.erro}>{erro[tipo]}</p>
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
                <p className={styles.erro}>{erro[tipo]}</p>
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
                <p className={styles.erro}>{erro[tipo]}</p>
            </>
        }

        return <Input placeholder={tipo} defaultValue={formulario[tipo]} type={tipoValorInput(tipo)} disabled={desabilitar} name={tipo} onChange={changeformulario} />
    }

    return (
        <div>
            <Button color="success" onClick={toggle}>
                EDITAR
            </Button>
            <Modal backdrop="static" isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EDITAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {formulario ? Object.keys(formulario).map((valor, index) => {
                                return (
                                    <div key={index}>
                                        <div className="">
                                            <Label htmlFor={valor} className={styles.labels}>{tipoLabel(valor)}</Label>
                                            {tipoInput(valor)}
                                            <p className={styles.erro}>{erro[valor]}</p>
                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </FormGroup>
                        <span className={styles.erro}>{msg}</span>
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
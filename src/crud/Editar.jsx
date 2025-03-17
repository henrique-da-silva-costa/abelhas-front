import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';

const Editar = ({ inputs = {}, url, urlGet }) => {
    const [formulario, setformularuio] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("EDITAR");
    const [modal, setModal] = useState(false);

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        setformularuio({
            ...formulario, [name]: value
        })
    }

    const pegardados = () => {
        axios.get(`http://localhost:8000/${urlGet}`).then((res) => {
            setformularuio(res.data)
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

    const tipoInput = (tipo) => {
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


    return (
        <div>
            <Button color="success" onClick={toggle}>
                EDITAR
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EDITAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {formulario ? Object.keys(formulario).map((valor, index) => {
                                return (
                                    <div key={index}>
                                        <div className="">
                                            <Label htmlFor={valor} className={styles.labels}>{tipoLabel(valor)}</Label>
                                            <Input placeholder={valor} defaultValue={formulario[valor]} type={tipoInput(valor)} disabled={desabilitar} name={valor} onChange={changeformulario} />
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
import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from "../stilos.module.css"
import axios from 'axios';

const Cadastrar = ({ inputs = {}, url }) => {
    const [formulario, setformularuio] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("CADASTRAR");

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        setformularuio({
            ...formulario, [name]: value
        })
    }

    const enviar = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/${url}`, formulario, {
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
    }

    return (
        <div>
            <Button color="success" onClick={toggle}>
                CADASTRAR
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>CADASTRAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {formulario ? Object.keys(formulario).map((valor, index) => {
                                return (
                                    <div key={index}>
                                        <div className="">
                                            <Label htmlFor={valor} className={styles.labels}>{valor}</Label>
                                            <Input placeholder={valor} type={tipoInput(valor)} disabled={desabilitar} name={valor} onChange={changeformulario} />
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

export default Cadastrar
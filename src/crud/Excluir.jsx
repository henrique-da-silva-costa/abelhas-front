import axios from 'axios';
import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import styles from "../stilos.module.css";
import { FaTrashCan } from 'react-icons/fa6';

const Excluir = ({ titulo = "EXCLUIR", id = null, url, pegarDados = () => { } }) => {
    const [modal, setModal] = useState(false);
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [botaoDesabilitar, setBotaoDesabilitar] = useState(false);
    const [botaoMsg, setBotaoMsg] = useState("EXCLUIR");

    const toggle = () => {
        setModal(!modal);
        setMsg("");
    };

    const excluir = () => {
        setBotaoDesabilitar(true);
        setBotaoMsg("CAREGANDO...");

        axios.options(`https://abelhas.shop/${url}`, {
            withCredentials: true,
            headers: {
                "X-CSRF-TOKEN": localStorage.getItem("token")
            }
        }).then((res) => {
            if (res.data.error) {
                setMsg(res.data.msg);
                setMsgCor(styles.erro);
                setBotaoDesabilitar(false);
                setBotaoMsg("EXCLUIR");
                return;
            }

            pegarDados();
            setMsg(res.data.msg);
            setMsgCor(styles.sucesso);
            setTimeout(() => {
                setModal(false);
                setBotaoDesabilitar(false);
            }, 1200);
            setBotaoMsg("EXCLUIR");
        }).catch((err) => {
            setModal(true);
            if (!err.response) {
                setMsg("Erro interno no servidor, contate o suporte")
            }
            setBotaoDesabilitar(false);
            setBotaoMsg("EXCLUIR");
        });
    }

    return (
        <div>
            <Button color="transparent" className="border border-0" onClick={toggle}>
                <FaTrashCan color="red" fontSize={22} />
            </Button>
            <Modal backdrop="static" isOpen={modal}>
                <ModalHeader toggle={toggle}>{titulo}</ModalHeader>
                <ModalBody className="d-flex gap-2 flex-column justify-content-end">
                    <div className="d-flex gap-2 justify-content-end">
                        <Button color="secondary" disabled={botaoDesabilitar} onClick={toggle}>
                            CANCELAR
                        </Button>
                        <Button color="danger" disabled={botaoDesabilitar} onClick={excluir}>{botaoMsg}</Button>
                    </div>
                    <div className="text-end">
                        <p className={msgCor}>{msg}</p>
                    </div>
                </ModalBody>
            </Modal>
        </div >
    );
}

export default Excluir

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ModalInformacoes({ textoBotao, conteudo, titulo }) {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button color="primary" onClick={toggle}>
                {textoBotao}
            </Button>
            <Modal backdrop="static" isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{titulo}</ModalHeader>
                <ModalBody className="text-break">
                    {/* {conteudo.length > 300 ? conteudo.slice(30) + "..." : conteudo} */}
                    {conteudo.length > 500 ? conteudo.substr(0, 500) + "..." : conteudo}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        FECHAR
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalInformacoes;
import React, { useContext, useState } from 'react'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Abelhas from './paginas/Abelhas';
import Divisoes from './paginas/Divisoes';
import { Usuario } from './contexts/Usuario';

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [componente, setComponente] = useState(<Abelhas />);
    const { setAuth } = useContext(Usuario);

    const linkPagina = (valor) => {
        setIsOpen(false);
        setComponente(valor)
    }

    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <div>
                <Button color="primary" onClick={toggle}>
                    Open Offcanvas
                </Button>
                <Offcanvas backdrop="static" isOpen={isOpen} toggle={toggle}>
                    <OffcanvasHeader toggle={toggle}>
                        Offcanvas Title
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <div className="d-flex flex-column gap-2 justify-content-end align-items-start">
                            <Button onClick={() => linkPagina(<Abelhas />)}>Abelhas</Button>
                            <Button onClick={() => linkPagina(<Divisoes />)}>Divisoes</Button>
                            <Button color="danger" onClick={() => setAuth(false)}>SAIR</Button>
                        </div>
                    </OffcanvasBody>
                </Offcanvas>
            </div >
            {componente}
        </>
    )
}

export default Home
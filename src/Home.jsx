import React, { useContext, useEffect, useState } from 'react'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Abelhas from './paginas/Abelhas';
import Divisoes from './paginas/Divisoes';
import { Usuario } from './contexts/Usuario';
import axios from 'axios';
import DoadorasCampeiras from './paginas/DoadorasCampeiras';
import DoadorasDiscos from './paginas/DoadorasDiscos';

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [componente, setComponente] = useState(<Abelhas />);
    const { setAuth } = useContext(Usuario);


    useEffect(() => {
        axios.get("http://localhost:8000/token", { withCredentials: true })
            .then(response => {
                localStorage.setItem("token", response.data.token);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

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
                            <Button onClick={() => linkPagina(<DoadorasCampeiras />)}>Doadoras Campeiras</Button>
                            <Button onClick={() => linkPagina(<DoadorasDiscos />)}>Doadoras Discos</Button>
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
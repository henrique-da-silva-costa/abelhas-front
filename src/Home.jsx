import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Abelhas from './paginas/Abelhas';
import Divisoes from './paginas/Divisoes';
import axios from 'axios';
import Cadastrar from './crud/Cadastrar';

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const nav = useNavigate();
    const [componente, setComponente] = useState();

    useEffect(() => {
        axios.get("http://localhost:8000/token", { withCredentials: true })
            .then(response => {
                localStorage.setItem("token", response.data.token);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const inputs = {
        nome: "",
        email: "",
        senha: "",
        confirmaSenha: ""
    }

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
                        <div className="d-flex flex-column gap-2">
                            <Button onClick={() => linkPagina(<Abelhas />)}>Abelhas</Button>
                            <Button onClick={() => linkPagina(<Divisoes />)}>Divisoes</Button>
                        </div>
                    </OffcanvasBody>
                </Offcanvas>
            </div>
            <Cadastrar inputs={inputs} url={"usuario/cadastrar"} />
            {componente}
        </>
    )
}

export default Home
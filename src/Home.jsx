import React, { useContext, useEffect, useState } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Abelhas from './paginas/Abelhas';
import { Usuario } from './contexts/Usuario';
import axios from 'axios';
import { TiThMenu } from 'react-icons/ti';
import styles from "./stilos.module.css";
import imgSemUsuario from "./usuario.png"


const Home = () => {
    const componentes = {
        Abelhas: <Abelhas />
    }

    const [usuario] = useState(JSON.parse(sessionStorage.getItem("usuario")));
    const [isOpen, setIsOpen] = useState(false);
    const [componente, setComponente] = useState(componentes["Abelhas"]);
    const { setAuth } = useContext(Usuario);

    useEffect(() => {
        setComponente(componentes[localStorage.getItem("pagina")]);

        axios.get("https://abelhas.shop/token", { withCredentials: true })
            .then(response => {
                localStorage.setItem("token", response.data.token);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const logOut = () => {
        setAuth(false);
        sessionStorage.removeItem("usuario");
    }

    const linkPagina = (valor) => {
        localStorage.setItem("pagina", valor);
        setIsOpen(false);
        setComponente(componentes[localStorage.getItem("pagina")]);
    }

    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <div>
                <Button color="transparent" className="border border-0" onClick={toggle}>
                    <TiThMenu fontSize={30} />
                </Button>
                <Offcanvas backdrop="static" isOpen={isOpen} toggle={toggle}>
                    <OffcanvasHeader toggle={toggle}>
                        {
                            usuario ? <div className="d-flex gap-1">
                                <img className={styles.imgUsuario} src={usuario.img ? usuario.img : imgSemUsuario} alt="" height={100} />
                                <p>{usuario.nome}</p>
                            </div> : "SEM IMAGEM"
                        }
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <div className="d-flex flex-column gap-2 justify-content-end align-items-start">
                            <Button color="danger" onClick={logOut}>SAIR</Button>
                        </div>
                    </OffcanvasBody>
                </Offcanvas>
            </div >
            {componente ? componente : ""}
        </>
    )
}

export default Home
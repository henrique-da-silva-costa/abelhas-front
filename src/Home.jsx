import React, { useContext, useEffect, useState } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Abelhas from './paginas/Abelhas';
import Divisoes from './paginas/Divisoes';
import { Usuario } from './contexts/Usuario';
import axios from 'axios';
import DoadorasCampeiras from './paginas/DoadorasCampeiras';
import DoadorasDiscos from './paginas/DoadorasDiscos';
import { TiThMenu } from 'react-icons/ti';
import styles from "./stilos.module.css";


const Home = () => {
    const componentes = {
        Abelhas: <Abelhas />,
        Divisoes: <Divisoes />,
        DoadorasCampeiras: <DoadorasCampeiras />,
        DoadorasDiscos: <DoadorasDiscos />
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
                                <img className={styles.imgUsuario} src={usuario.img} alt="" height={100} />
                                <p>{usuario.nome}</p>
                            </div> : ""
                        }
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <div className="d-flex flex-column gap-2 justify-content-end align-items-start">
                            <Button color="primary" className="w-100 mb-2" onClick={() => linkPagina("Abelhas")}>Abelhas</Button>
                            <Button className="w-100" onClick={() => linkPagina("Divisoes")}>Divisoes</Button>
                            <Button className="w-100 mb-2" onClick={() => linkPagina("DoadorasCampeiras")}>Doadoras Campeiras</Button>
                            <Button className="w-100" onClick={() => linkPagina("DoadorasDiscos")}>Doadoras Discos</Button>
                            <Button color="danger" onClick={logOut}>SAIR</Button>
                        </div>
                    </OffcanvasBody>
                </Offcanvas>
            </div >
            {componente}
        </>
    )
}

export default Home
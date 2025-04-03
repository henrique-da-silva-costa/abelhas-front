import React, { useEffect, useState } from 'react'
import { Badge, Button, Container, Table } from 'reactstrap'
import axios from 'axios';
import styles from "../stilos.module.css"
import Carregando from '../Carregando';

const Divisoes = () => {
    const usuarioId = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).id : "";
    const [dados, setDados] = useState([]);
    const [msg, setMsg] = useState("");
    const [removerLoading, setRemoverLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);

    const pegarDados = (page) => {
        setBotaoDesabilitado(true)
        axios.get("http://127.0.0.1:8000/colmeias/divisoes", {
            withCredentials: true,
            params: {
                "usuario_id": usuarioId,
                "page": page
            }
        }).then((res) => {
            setDados(res.data.data);
            setPaginaAtual(res.data.current_page);
            setTotalPages(res.data.last_page);
            setBotaoDesabilitado(false);
            setRemoverLoading(true);
        }).catch((err) => {
            setMsg("erro interno servidor, entre em  contato com o suporte");
            setBotaoDesabilitado(false);
        });
    }

    useEffect(() => {
        setTimeout(() => {
            pegarDados(paginaAtual);
        }, 1000);
    }, [paginaAtual]);

    const paginar = (page) => {
        setBotaoDesabilitado(true);
        if (page >= 1 && page <= totalPages) {
            setPaginaAtual(page);
        }
    };

    return (
        <Container className="mt-3">
            <h1>Doadoras de Disco</h1>
            <div className="row">
                {dados.length > 0 ?
                    <Table responsive size="sm" striped>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>DATA DE CRIAÇÃO</th>
                                <th>DOADORA DE DISCO</th>
                                <th>DOADORA DE CAMPEIRA</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {dados.length > 0 ? dados.map((dado, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <p>{dado.nome}</p>
                                            </td>
                                            <td>
                                                <p>{dado.data_criacao}</p>
                                            </td>
                                            <td>
                                                <p>{dado.doadora_disco_nome}</p>
                                            </td>
                                            <td>
                                                <p>{dado.doadora_campeira_nome}</p>
                                            </td>
                                        </tr>
                                    )
                                }) : ""}
                            </>
                        </tbody>
                    </Table> : ""}
                {msg ? <p className={styles.erro}>{msg}</p> : ""}
                {!removerLoading ? <Carregando /> : dados.length > 0 ? "" : <h2 className="text-center">SEM INFORMAÇÕES</h2>}
            </div>

            {dados.length > 0 ?
                <>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button
                            color="primary"
                            onClick={() => paginar(paginaAtual - 1)}
                            disabled={paginaAtual === 1 ? paginaAtual : botaoDesabilitado}
                        >
                            Anterior
                        </Button>
                        {[...Array(totalPages)].map((_, index) => (
                            <Button
                                color="primary"
                                disabled={index == paginaAtual - 1 ? true : botaoDesabilitado}
                                key={index + 1}
                                onClick={() => paginar(index + 1)}
                                className={paginaAtual === index + 1 ? "active" : ""}
                            >
                                {index + 1}
                            </Button>
                        ))}
                        <Button
                            color="primary"
                            onClick={() => paginar(paginaAtual + 1)}
                            disabled={paginaAtual === totalPages ? paginaAtual : botaoDesabilitado}
                        >
                            Próximo
                        </Button>
                    </div>
                    {botaoDesabilitado ? <Carregando /> : ""}
                </>
                : ""}
        </Container >
    )
}

export default Divisoes
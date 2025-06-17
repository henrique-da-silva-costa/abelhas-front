import React, { useEffect, useState } from 'react'
import { Badge, Button, Container, Table } from 'reactstrap'
import Cadastrar from '../crud/Cadastrar'
import axios from 'axios';
import styles from "../stilos.module.css"
import Carregando from '../Carregando';
import Editar from '../crud/Editar';
import Excluir from '../crud/Excluir';
import Filtros from './Filtros';

const DoadorasCampeiras = () => {
    const usuarioId = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).id : "";
    const [dados, setDados] = useState([]);
    const [msg, setMsg] = useState("");
    const [removerLoading, setRemoverLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);
    const [colmeias, setColmeias] = useState([]);

    const pegarDados = (page, filtros) => {
        setBotaoDesabilitado(true)
        axios.get("http://localhost:8000/doadoras/campeira", {
            withCredentials: true,
            params: {
                "usuario_id": usuarioId,
                filtros,
                page
            }
        }).then((res) => {
            if (res.data.length == 0) {
                setDados([]);
            } else {
                setDados(res.data.data);
                setPaginaAtual(res.data.current_page);
                setTotalPages(res.data.last_page);
                setBotaoDesabilitado(false);
                setRemoverLoading(true);
            }

            console.log(dados.length);
        }).catch((err) => {
            setMsg("erro interno servidor, entre em  contato com o suporte");
            setBotaoDesabilitado(false);
        });
    }

    useEffect(() => {
        axios.get("http://localhost:8000/colmeias/matrizes", { params: { usuario_id: usuarioId } }).then((res) => {
            setColmeias(res.data)
            console.log(res.data)
        }).catch((err) => {
            console.error(err);
        })

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

    const inputs = {
        colmeia_id: "",
        tipo_doacao_id: 2
    }

    return (
        <Container className="mt-3">
            <Filtros pegarDados={pegarDados} paginaAtual={paginaAtual} nomeFiltro={"doadoras"} />
            <h1>Doadoras de Campeira</h1>
            <div className="text-end">
                <Cadastrar formularioNome="doadora" pegarDadosCarregar={pegarDados} colmeiasMatrizes={colmeias} inputs={inputs} url={"doadora/cadastrar/campeira"} />
            </div>
            <div className="row">
                {dados.length > 0 ?
                    <Table responsive size="sm" striped>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {dados.length > 0 ? dados.map((dado, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <p>{dado.colmeia_nome}</p>
                                            </td>
                                            <td className="align-items-center d-flex gap-2 justify-content-end">
                                                <Editar formularioNome="doadora" pegarDadosCarregar={pegarDados} colmeiasMatrizes={colmeias} url={"doadora/editar/campeira"} urlGet={`doadora/campeira?id=${dado.id}`} />
                                                <Excluir pegarDados={pegarDados} url={`doadora/excluir/campeira?id=${dado.id}`} titulo={"Excluir colmeia"} />
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

export default DoadorasCampeiras
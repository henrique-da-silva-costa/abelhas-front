import React, { useEffect, useState } from 'react'
import { Badge, Button, Container, Table } from 'reactstrap'
import Cadastrar from '../crud/Cadastrar'
import axios from 'axios';
import styles from "../stilos.module.css"
import Carregando from '../Carregando';
import Editar from '../crud/Editar';
import Excluir from '../crud/Excluir';
import Filtros from './Filtros';
import ModalInformacoes from '../componentes/ModalInformacoes';

const Abelhas = () => {
    const usuarioId = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).id : "";
    const [dados, setDados] = useState([]);
    const [msg, setMsg] = useState("");
    const [removerLoading, setRemoverLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);
    const [generos, setGeneros] = useState([]);
    const [status, setStatus] = useState([]);

    const pegarDados = (page, filtros) => {
        setBotaoDesabilitado(true)
        axios.get("http://127.0.0.1:8000/colmeias", {
            withCredentials: true,
            params: {
                "usuario_id": usuarioId,
                filtros,
                page
            }
        }).then((res) => {
            if (res.data.data) {
                setDados(res.data.data);
                setPaginaAtual(res.data.current_page);
                setTotalPages(res.data.last_page);
            }

            setBotaoDesabilitado(false);
            setRemoverLoading(true);
        }).catch((err) => {
            setMsg("erro interno servidor, entre em  contato com o suporte");
            setBotaoDesabilitado(false);
        });
    }

    useEffect(() => {
        axios.get("http://localhost:8000/generos").then((res) => {
            setGeneros(res.data)
        }).catch((err) => {
            console.error(err);
        })

        axios.get("http://localhost:8000/status").then((res) => {
            setStatus(res.data)
        }).catch((err) => {
            console.error(err);
        })

        setTimeout(() => {
            pegarDados(paginaAtual, JSON.parse(localStorage.getItem("filtros")));
        }, 1000);
    }, [paginaAtual]);

    const paginar = (page) => {
        setBotaoDesabilitado(true);
        if (page >= 1 && page <= totalPages) {
            setPaginaAtual(page);
        }
    };

    const inputs = {
        img: null,
        nome: "",
        descricao: "",
        genero_id: "",
        especie_id: "",
        status_id: "",
        doadora_disco_id: "",
        doadora_campeira_id: "",
        usuario_id: usuarioId
    }

    return (
        <Container className="mt-3">
            <Filtros paginaAtual={paginaAtual} pegarDados={pegarDados} />
            <div className="d-flex justify-content-space-between">
                <h1>Abelhas</h1>
            </div>
            <div className="text-end">
                <Cadastrar pegarDadosCarregar={pegarDados} generos={generos} status={status} inputs={inputs} url={"colmeia/cadastrar"} tamanhoModal={"xl"} />
            </div>
            <div className="row">
                {dados.length > 0 ?
                    <Table responsive size="sm" striped>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>DATA CRIAÇÃO</th>
                                <th>STATUS</th>
                                <th>IMAGEM</th>
                                <th>DESCRIÇÃO</th>
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
                                                <Badge color={dado.status_id == 2 ? "success" : "secondary"}>
                                                    {dado.status_id == 2 ? "MATRIZ" : "DIVISÃO"}
                                                </Badge>
                                            </td>
                                            <td>
                                                {dado.img ?
                                                    <img src={dado.img} height={50} alt="Imagem da colmeia"></img> : "SEM IMAGEM"
                                                }
                                                <Editar url={"colmeia/editar/img"} tipoDeDadosDoFormulario={"multipart/form-data"} urlGet={`colmeia/img?id=${dado.id}`} />
                                            </td>
                                            <td>
                                                <ModalInformacoes titulo={"Descrição"} conteudo={dado.descricao} textoBotao={"VER MAIS"} />
                                            </td>
                                            <td className="align-items-center d-flex gap-2 justify-content-end">
                                                <Editar tamanhoModal={"xl"} pegarDadosCarregar={pegarDados} generos={generos} status={status} url={"colmeia/editar"} urlGet={`colmeia?id=${dado.id}`} />
                                                <Excluir pegarDados={pegarDados} url={`colmeia/excluir?id=${dado.id}`} titulo={"Excluir colmeia"} />
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

export default Abelhas
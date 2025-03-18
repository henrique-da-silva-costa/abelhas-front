import React, { useEffect, useState } from 'react'
import { Button, Container, Table } from 'reactstrap'
import Cadastrar from '../crud/Cadastrar'
import axios from 'axios';
import styles from "../stilos.module.css"
import Carregando from '../Carregando';
import Editar from '../crud/Editar';
import Excluir from '../crud/Excluir';

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

    const pegarDados = (page) => {
        setBotaoDesabilitado(true)
        axios.get("http://127.0.0.1:8000/colmeias", {
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
        nome: "",
        data_criacao: "",
        data_alteracao: "",
        data_divisao: "",
        genero_id: "",
        especie_id: "",
        status_id: "",
        doadora_id: "",
        tipo_divisao_id: "",
        doadora_id2: "",
        usuario_id: usuarioId
    }

    return (
        <Container className="mt-3">
            <div className="text-end">
                <Cadastrar generos={generos} status={status} inputs={inputs} url={"colmeia/cadastrar"} />
            </div>
            <div className="row">
                {dados.length > 0 ?
                    <Table responsive size="sm" striped>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Cidade/Estado</th>
                                <th>Bairro/Rua</th>
                                <th>Numero</th>
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
                                            <td className="align-items-center d-flex gap-2 justify-content-center">
                                                <Editar generos={generos} status={status} url={"colmeia/editar"} urlGet={`colmeia?id=${dado.id}`} />
                                                <Excluir url={`colmeia/excluir?id=${dado.id}`} titulo={"Excluir colmeia"} />
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
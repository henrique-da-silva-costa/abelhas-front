import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Button, Container, Input, InputGroup } from 'reactstrap';

const Filtros = ({ paginaAtual, pegarDados = () => { }, nomeFiltro = "" }) => {
    const [formulario, setFormulario] = useState({});
    const [desabilitarEspecie, setDesabilitarEspecie] = useState(false);
    const [especies, setEspecies] = useState([]);
    const formRef = useRef()
    const filtrosLimitados = ["doadoras", "divisoes"];

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        if (name == "genero" && value > 0) {
            setDesabilitarEspecie(true);

            axios.get("https://abelhas.shop/especies", { params: { genero_id: value } }).then((res) => {
                setEspecies(res.data)
                setDesabilitarEspecie(false)
            }).catch((err) => {
                console.error(err);
            })
        }

        setFormulario({
            ...formulario, [name]: name === "img" ? files[0] : value
        });

    }

    const filtrar = (e) => {
        e.preventDefault();
        pegarDados(paginaAtual, formulario);
        localStorage.setItem("filtros", JSON.stringify(formulario));
    }

    const limpar = (e) => {
        e.preventDefault();
        pegarDados(paginaAtual, {});
        setFormulario({});
        formRef.current.reset();
        localStorage.setItem("filtros", JSON.stringify({}));
    }

    return (
        <Container>
            <form ref={formRef} onSubmit={filtrar}>
                <InputGroup>
                    <Input name="nome" onChange={changeformulario} />
                    <select className={`form-control ${filtrosLimitados.includes(nomeFiltro) ? "d-none" : ""} `} onChange={changeformulario} name="status" id="">
                        <option value="">SELECIONE</option>
                        <option value="1">DIVISÃO</option>
                        <option value="2">MATRIZ</option>
                    </select>
                    <select className="form-control" onChange={changeformulario} name="genero">
                        <option value="">SELECIONE</option>
                        <option value="1">Meliponas</option>
                        <option value="2">Scaptrigonas</option>
                        <option value="3">Trigonas</option>
                    </select>
                    <select className="form-control" disabled={desabilitarEspecie} onChange={changeformulario} name="especie">
                        <option value="">SELECIONE</option>
                        {especies.length > 0 ? especies.map((especie, index) => {
                            return (
                                <option key={index} value={especie.id}>{especie.especie}</option>
                            )
                        }) : <option value="">SELECIONE</option>}
                    </select>
                    <Button color="primary">Filtrar</Button>
                </InputGroup>
            </form>
            <Button className="mt-2" onClick={limpar} color="secondary">Limpar</Button>
        </Container>
    )
}

export default Filtros
import React, { useRef, useState } from 'react'
import { Button, Container, Input, InputGroup } from 'reactstrap';

const Filtros = ({ paginaAtual, pegarDados = () => { }, nomeFiltro = "" }) => {
    const [formulario, setFormulario] = useState({});
    const formRef = useRef()
    const filtrosLimitados = ["doadoras", "divisoes"];

    const changeformulario = (e) => {
        const { name, value, files } = e.target;

        setFormulario({
            ...formulario, [name]: name === "img" ? files[0] : value
        });
    }

    const filtrar = (e) => {
        e.preventDefault();
        pegarDados(paginaAtual, formulario);
    }

    const limpar = (e) => {
        e.preventDefault();
        pegarDados(paginaAtual, {});
        setFormulario({});
        formRef.current.reset();
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
                    <select className={`form-control ${filtrosLimitados.includes(nomeFiltro) ? "d-none" : ""} `} onChange={changeformulario} name="genero" id="">
                        <option value="">SELECIONE</option>
                        <option value="1">Meliponas</option>
                        <option value="2">Scaptrigonas</option>
                        <option value="3">Trigonas</option>
                    </select>
                    <Button color="primary">Filtrar</Button>
                </InputGroup>
            </form>
            <Button className="mt-2" onClick={limpar} color="secondary">Limpar</Button>
        </Container>
    )
}

export default Filtros
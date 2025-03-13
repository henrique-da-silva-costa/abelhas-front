import React from 'react'
import { Container } from 'reactstrap'
import Cadastrar from '../crud/Cadastrar'

const Abelhas = () => {
    const inputs = {
        _token: "",
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
    }

    return (
        <Container>
            <Cadastrar inputs={inputs} url={"colmeia/cadastrar"} />
        </Container>
    )
}

export default Abelhas
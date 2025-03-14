import React from 'react'
import { Container } from 'reactstrap'
import Cadastrar from '../crud/Cadastrar'

const Abelhas = () => {
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
        usuario_id: JSON.parse(sessionStorage.getItem("usuario")).id,
    }

    return (
        <Container>
            <div className="text-end">
                <Cadastrar inputs={inputs} url={"colmeia/cadastrar"} />
            </div>
        </Container>
    )
}

export default Abelhas
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap';

const NaoEncontrado = () => {
    const nav = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '3rem', color: '#ff6347' }}>404 - Página Não Encontrada</h1>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Desculpe, a página que você está procurando não existe.
            </p>
            <Button color="primary" onClick={() => nav("/")}>
                Voltar para a página inicial
            </Button>
        </div>
    )
}

export default NaoEncontrado
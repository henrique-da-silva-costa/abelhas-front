import React from 'react'
import Home from '../Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NaoEncontrado from '../paginas/NaoEncontrado'
import Abelhas from '../paginas/Abelhas'

const PadraoRotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Abelhas />} />
                <Route path="*" element={<NaoEncontrado />} />/
            </Routes>
        </BrowserRouter>
    )
}

export default PadraoRotas
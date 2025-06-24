import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NaoEncontrado from '../paginas/NaoEncontrado'
import Abelhas from '../paginas/Abelhas'
import Home from '../Home'

const PadraoRotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NaoEncontrado />} />/
            </Routes>
        </BrowserRouter>
    )
}

export default PadraoRotas
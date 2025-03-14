import React from 'react'
import Home from '../Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NaoEncontrado from '../paginas/NaoEncontrado'

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
import { useEffect, useState } from 'react'
import './App.css'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Abelhas from './paginas/Abelhas';

function App() {
  const [token, setToken] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    axios.get("http://localhost:8000/token", { withCredentials: true })
      .then(response => {
        localStorage.setItem("token", response.data.token);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

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
    <>
      <div>
        <Button color="primary" onClick={toggle}>
          Open Offcanvas
        </Button>
        <Offcanvas backdrop="static" isOpen={isOpen} toggle={toggle}>
          <OffcanvasHeader toggle={toggle}>
            Offcanvas Title
          </OffcanvasHeader>
          <OffcanvasBody>
            This is the content of the offcanvas.
          </OffcanvasBody>
        </Offcanvas>
        <Cadastrar inputs={inputs} />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Abelhas />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

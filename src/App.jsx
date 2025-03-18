import { useContext, useEffect } from 'react'
import './App.css'
import { Usuario } from './contexts/Usuario';
import LoginRotas from './rotas/LoginRotas';
import PadraoRotas from './rotas/PadraoRotas';
import axios from 'axios';

function App() {
  const { auth, setAuth } = useContext(Usuario)
  const usuarioEmail = sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")).email : "";

  useEffect(() => {
    axios.get("http://localhost:8000/token", { withCredentials: true })
      .then(response => {
        localStorage.setItem("token", response.data.token);
      })
      .catch(error => {
        console.error(error);
      });

    axios.get("http://localhost:8000/verificaremailapp", {
      withCredentials: true,
      params: { email: usuarioEmail }
    })
      .then(res => {
        if (res.data.erro) {
          setAuth(false);
        }
      })
      .catch(err => {
        if (err) {
          alert("algo deu errado. Por favor contate o suporte");
          setAuth(false);
        }
      });
  }, []);


  return auth ? <PadraoRotas /> : <LoginRotas />
}

export default App

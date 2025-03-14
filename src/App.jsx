import { useContext, useEffect } from 'react'
import './App.css'
import { Usuario } from './contexts/Usuario';
import LoginRotas from './rotas/LoginRotas';
import PadraoRotas from './rotas/PadraoRotas';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios.get("http://localhost:8000/token", { withCredentials: true })
      .then(response => {
        localStorage.setItem("token", response.data.token);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const { auth, setAuth } = useContext(Usuario)

  return auth ? <PadraoRotas /> : <LoginRotas />
}

export default App

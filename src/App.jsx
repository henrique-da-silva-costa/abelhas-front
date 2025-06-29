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
    axios.get("https://abelhas.shop/verificaremailapp", {
      withCredentials: true,
      params: { email: usuarioEmail }
    })
      .then(res => {
        if (res.data.erro) {
          setAuth(false);
        }

        setAuth(true);
      })
      .catch(err => {
        console.error(err);
        if (err) {
          setAuth(false);
        }
      });
  }, []);


  return auth ? <PadraoRotas /> : <LoginRotas />
}

export default App

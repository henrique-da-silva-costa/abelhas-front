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
    console.log(usuarioEmail);

    axios.get("http://localhost:8000/verificaremailapp", {
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
          // alert("algo deu errado. Por favor contate o suporte");
          setAuth(false);
        }
      });
  }, []);


  return auth ? <PadraoRotas /> : <LoginRotas />
}

export default App

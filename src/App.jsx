import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';

function App() {
  const [token, setToken] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/abelhas" element={<Abelhas />} />
          <Route path="/divisoes" element={<Divisoes />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
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
    </div>
  )
}

export default App

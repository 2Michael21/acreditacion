import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieSchedule from './pages/MovieSchedule';
import Asientos from './pages/asientos';
//import PurchaseSuccess from './PurchaseSuccess'; // Página de éxito de compra
import Cartelera from './pages/cartelera';
import Tickets from './pages/tickets';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schedule" element={<MovieSchedule />} />
        <Route path="/cartelera" element={<Cartelera/>}/>
        <Route path="/seat-selection/:functionId" element={<Asientos />} />
        <Route path='/tickets' element={<Tickets/>}/>
      </Routes>
    </Router>
  );
};

export default App;

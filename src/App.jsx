import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import LoginCadastro from './pages/LoginCadastro.jsx';
import CursoPlayer from './pages/CursoPlayer.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container my-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginCadastro />} />
                    <Route path="/curso/:id" element={<CursoPlayer />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
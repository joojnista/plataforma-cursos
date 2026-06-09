import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {

        const dadosUsuario = localStorage.getItem('usuarioLogado');

        if (dadosUsuario) {
            setUsuario(JSON.parse(dadosUsuario));
        }
    }, []);

    function lidarComLogout() {
        localStorage.removeItem('usuarioLogado');
        navigate('/login');
    }

    if (!usuario) {
        return (
            <div className="container mt-5 text-center" style={{ maxWidth: '600px' }}>
                <div className="card p-5 shadow-sm border-0 bg-light">
                    <div className="fs-1 mb-3">🔒</div>
                    <h3 className="fw-bold text-dark">Acesso Restrito</h3>
                    <p className="text-muted mb-4">
                        Você precisa estar conectado para visualizar o seu painel de aprendizado e acompanhar seu progresso.
                    </p>
                    <Link to="/login" className="btn btn-primary px-4 py-2 fw-bold">
                        Ir para a página de Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-2">
            {/* Cabeçalho do Painel */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h2 className="fw-bold text-dark">Olá, {usuario.nomeCompleto}!</h2>
                    <p className="text-muted mb-0">Bem-vindo ao seu painel acadêmico. Aqui está o resumo das suas atividades.</p>
                </div>
                <button onClick={lidarComLogout} className="btn btn-outline-danger fw-bold">
                    🚪 Sair da Conta
                </button>
            </div>

            {/* Grid de Estatísticas Rápidas (Cards Informativos do Bootstrap) */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card h-100 p-4 border-0 bg-primary text-white shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title opacity-75">Cursos Matriculados</h5>
                            <p className="display-4 fw-bold">1</p>
                            <small className="opacity-75">Curso ativo no momento</small>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 p-4 border-0 bg-success text-white shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title opacity-75">Aulas Concluídas</h5>
                            <p className="display-4 fw-bold">0</p>
                            <small className="opacity-75">Continue assistindo para pontuar</small>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 p-4 border-0 bg-dark text-white shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title opacity-75">Certificados Disponíveis</h5>
                            <p className="display-4 fw-bold">0</p>
                            <small className="opacity-75">Conclua 100% de um curso para liberar</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção: Meus Cursos em Andamento */}
            <div className="card shadow-sm border-0 p-4 bg-light">
                <h4 className="fw-bold mb-4 text-dark">Continue de onde parou</h4>

                <div className="row align-items-center bg-white p-3 rounded border mx-1 shadow-sm">
                    <div className="col-md-8 mb-3 mb-md-0">
                        <span className="badge bg-primary mb-2">Em Andamento</span>
                        <h5 className="fw-bold text-dark mb-1">React do Zero ao Avançado</h5>
                        <p className="text-muted small mb-0">Próxima aula: O que é o React e Componentes</p>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <Link to="/curso/1" className="btn btn-primary fw-bold">
                            Abrir Player 📺
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
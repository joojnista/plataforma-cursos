import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function buscarDados() {
            try {
                const [respostaCursos, respostaCategorias] = await Promise.all([
                    api.get('/cursos'),
                    api.get('/categorias')
                ]);

                setCursos(respostaCursos.data);
                setCategorias(respostaCategorias.data);
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarDados();
    }, []);

    if (carregando) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Banner de Boas-Vindas */}
            <div className="p-4 mb-5 bg-primary text-white rounded-3 shadow-sm">
                <h1 className="display-5 fw-bold">Bem-vindo à LAB-Cursos</h1>
                <p className="lead">Sua plataforma definitiva de aprendizado acadêmico e profissional.</p>
            </div>

            <div className="row">
                {/* Lateral: Categorias (Filtro Lateral exigido no escopo) */}
                <div className="col-md-3 mb-4">
                    <h4 className="mb-3">Categorias</h4>
                    <div className="list-group shadow-sm">
                        <button className="list-group-item list-group-item-action active">
                            Todas as Categorias
                        </button>
                        {categorias.map(cat => (
                            <button key={cat.id} className="list-group-item list-group-item-action">
                                {cat.nome}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Centro/Direita: Listagem de Cursos em Grid de Cards Bootstrap */}
                <div className="col-md-9">
                    <h4 className="mb-3">Cursos Disponíveis ({cursos.length})</h4>
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        {cursos.map(curso => (
                            <div className="col" key={curso.id}>
                                <div className="card h-100 shadow-sm border-0 bg-light">
                                    <div className="card-body d-flex flex-column">
                                        <span className="badge bg-secondary align-self-start mb-2">{curso.nivel}</span>
                                        <h5 className="card-title fw-bold text-dark">{curso.titulo}</h5>
                                        <p className="card-text text-muted flex-grow-1">{curso.descricao}</p>
                                        <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                                            <small className="text-muted">⏱️ {curso.totalHoras}h de conteúdo</small>
                                            {/* Link dinâmico para ir para a página interna deste curso específico */}
                                            <Link to={`/curso/${curso.id}`} className="btn btn-outline-primary btn-sm">
                                                Acessar Curso
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
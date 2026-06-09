import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function CursoPlayer() {
    const { id } = useParams();

    const [curso, setCurso] = useState(null);
    const [modulos, setModulos] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [aulaAtiva, setAulaAtiva] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [aulaConcluida, setAulaConcluida] = useState(false);

    useEffect(() => {
        async function carregarDadosCurso() {
            try {
                const respostaCurso = await api.get(`/cursos/${id}`);
                setCurso(respostaCurso.data);

                const respostaModulos = await api.get(`/modulos`);
                const modulosDoCurso = respostaModulos.data.filter(
                    m => String(m.id_curso) === String(id)
                );
                setModulos(modulosDoCurso);

                const respostaAulas = await api.get('/aulas');
                const idsModulos = modulosDoCurso.map(m => String(m.id));

                const aulasDoCurso = respostaAulas.data.filter(
                    aula => idsModulos.includes(String(aula.id_modulo))
                );

                setAulas(aulasDoCurso);

                if (aulasDoCurso.length > 0) {
                    setAulaAtiva(aulasDoCurso[0]);
                }

            } catch (error) {
                console.error("Erro ao carregar dados do curso:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarDadosCurso();
    }, [id]);

    if (carregando) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (!curso) {
        return (
            <div className="alert alert-danger my-4" role="alert">
                Curso não encontrado. <Link to="/">Voltar ao Catálogo</Link>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-2">
            {/* Cabeçalho do Curso */}
            <div className="row mb-4">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Catálogo</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{curso.titulo}</li>
                        </ol>
                    </nav>
                    <h2 className="fw-bold text-dark">{curso.titulo}</h2>
                    <p className="text-muted">{curso.descricao}</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Lado Esquerdo: Player de Vídeo */}
                <div className="col-lg-8">
                    {aulaAtiva ? (
                        <div>
                            <div className="ratio ratio-16x9 bg-black rounded shadow-sm mb-3">
                                <iframe
                                    src={aulaAtiva.url_conteudo}
                                    title={aulaAtiva.titulo}
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="card p-4 border-0 bg-light shadow-sm mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h4 className="fw-bold mb-0">{aulaAtiva.titulo}</h4>
                                    <span className="badge bg-primary px-3 py-2"> ⏱️ {aulaAtiva.duracaoMinutos} min</span>
                                </div>
                                <p className="text-muted mb-3">Tipo de conteúdo: {aulaAtiva.tipoConteudo}</p>

                                <button
                                    className={`btn ${aulaConcluida ? 'btn-success' : 'btn-outline-success'} fw-bold py-2`}
                                    onClick={() => setAulaConcluida(!aulaConcluida)}
                                >
                                    {aulaConcluida ? '✓ Aula Concluída!' : 'Marcar como Concluída'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-warning" role="alert">
                            Este curso ainda não possui aulas cadastradas.
                        </div>
                    )}
                </div>

                {/* Lado Direito: Grade Curricular (Módulos e Aulas) */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white py-3">
                            <h5 className="mb-0 fw-bold">Conteúdo do Curso</h5>
                        </div>
                        <div className="card-body p-0">
                            {modulos.length === 0 ? (
                                <p className="p-3 text-muted mb-0">Nenhum módulo cadastrado.</p>
                            ) : (
                                modulos.map((modulo, index) => {
                                    const aulasDoModulo = aulas.filter(a => a.id_modulo === modulo.id);

                                    return (
                                        <div key={modulo.id} className="border-bottom">
                                            <div className="bg-light p-3 fw-bold text-secondary d-flex justify-content-between align-items-center">
                                                <span>Módulo {index + 1}: {modulo.titulo}</span>
                                                <span className="badge bg-secondary text-white rounded-pill fs-7">
                          {aulasDoModulo.length} {aulasDoModulo.length === 1 ? 'aula' : 'aulas'}
                        </span>
                                            </div>

                                            <div className="list-group list-group-flush">
                                                {aulasDoModulo.map(aula => (
                                                    <button
                                                        key={aula.id}
                                                        className={`list-group-item list-group-item-action text-start py-3 d-flex align-items-center ${
                                                            aulaAtiva && aulaAtiva.id === aula.id ? 'active fw-bold' : ''
                                                        }`}
                                                        onClick={() => {
                                                            setAulaAtiva(aula);
                                                            setAulaConcluida(false);
                                                        }}
                                                    >
                                                        <span className="me-2">▶</span>
                                                        <div className="flex-grow-1">
                                                            <div>{aula.titulo}</div>
                                                            <small className={`${aulaAtiva && aulaAtiva.id === aula.id ? 'text-white' : 'text-muted'}`}>
                                                                {aula.duracaoMinutos} mins
                                                            </small>
                                                        </div>
                                                    </button>
                                                ))}
                                                {aulasDoModulo.length === 0 && (
                                                    <div className="p-3 text-muted small">Nenhuma aula neste módulo.</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
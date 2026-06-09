import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LoginCadastro() {
    const navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');

    const [cadastroNome, setCadastroNome] = useState('');
    const [cadastroEmail, setCadastroEmail] = useState('');
    const [cadastroSenha, setCadastroSenha] = useState('');

    const [mensagemSucesso, setMensagemSucesso] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    async function lidarComLogin(e) {
        e.preventDefault();
        setMensagemErro('');
        setMensagemSucesso('');

        try {
            const resposta = await api.get('/usuarios');
            const usuarios = resposta.data;

            const usuarioEncontrado = usuarios.find(
                (u) => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase() &&
                    String(u.senhaHash) === String(loginSenha)
            );

            if (usuarioEncontrado) {
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

                setMensagemSucesso(`Bem-vindo de volta, ${usuarioEncontrado.nomeCompleto}!`);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setMensagemErro('E-mail ou senha incorretos.');
            }
        } catch (error) {
            console.error(error);
            setMensagemErro('Erro ao tentar conectar ao servidor.');
        }
    }

    async function lidarComCadastro(e) {
        e.preventDefault();
        setMensagemErro('');
        setMensagemSucesso('');

        if (!cadastroNome || !cadastroEmail || !cadastroSenha) {
            setMensagemErro('Por favor, preencha todos os campos do cadastro.');
            return;
        }

        try {
            const respostaGeral = await api.get('/usuarios');
            const emailExiste = respostaGeral.data.some(
                (u) => u.email.trim().toLowerCase() === cadastroEmail.trim().toLowerCase()
            );

            if (emailExiste) {
                setMensagemErro('Este e-mail já está em uso.');
                return;
            }

            const novoUsuario = {
                id: String(Date.now()),
                nomeCompleto: cadastroNome.trim(),
                email: cadastroEmail.trim(),
                senhaHash: String(cadastroSenha),
                dataCadastro: new Date().toISOString().split('T')[0]
            };

            await api.post('/usuarios', novoUsuario);

            setMensagemSucesso('Cadastro realizado com sucesso! Pode fazer o seu login.');

            setCadastroNome('');
            setCadastroEmail('');
            setCadastroSenha('');
        } catch (error) {
            setMensagemErro('Erro ao realizar o cadastro.');
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '900px' }}>

            {/* Exibição de alertas de feedback */}
            {mensagemSucesso && (
                <div className="alert alert-success shadow-sm" role="alert">
                    {mensagemSucesso}
                </div>
            )}
            {mensagemErro && (
                <div className="alert alert-danger shadow-sm" role="alert">
                    {mensagemErro}
                </div>
            )}

            <div className="row g-5">

                {/* Coluna 1: Formulário de Login */}
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm border-0 bg-light">
                        <h3 className="mb-4 fw-bold text-dark">Já tenho conta</h3>
                        <form onSubmit={lidarComLogin}>
                            <div className="mb-3">
                                <label className="form-label">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="exemplo@teste.com"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={loginSenha}
                                    onChange={(e) => setLoginSenha(e.target.value)}
                                    placeholder="******"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                                Entrar na Plataforma
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coluna 2: Formulário de Cadastro */}
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm border-0 bg-light">
                        <h3 className="mb-4 fw-bold text-dark">Criar uma nova conta</h3>
                        <form onSubmit={lidarComCadastro}>
                            <div className="mb-3">
                                <label className="form-label">Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cadastroNome}
                                    onChange={(e) => setCadastroNome(e.target.value)}
                                    placeholder="Seu nome aqui"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={cadastroEmail}
                                    onChange={(e) => setCadastroEmail(e.target.value)}
                                    placeholder="exemplo@teste.com"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Senha de Acesso</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={cadastroSenha}
                                    onChange={(e) => setCadastroSenha(e.target.value)}
                                    placeholder="Crie uma senha forte"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-success w-100 py-2 fw-bold">
                                Cadastrar Conta
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
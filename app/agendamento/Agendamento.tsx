'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { User, Phone, MapPin, CalendarDays, Clock3, Sparkles, ChevronDown, Check, type LucideIcon } from 'lucide-react';
import { api } from '@/utils/api';

// Preencher horários conforme a agenda real do estabelecimento
const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// Deixado vazio — adicionar aqui as opções de serviço quando definidas
const SERVICOS: string[] = [];

function formatarTelefone(valor: string): string {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    const ddd = digitos.slice(0, 2);
    const meio = digitos.slice(2, 7);
    const fim = digitos.slice(7, 11);
    let saida = '';
    if (ddd) saida = `(${ddd}`;
    if (ddd.length === 2) saida += ') ';
    saida += meio;
    if (fim) saida += `-${fim}`;
    return saida;
}

type CampoProps = {
    icon: LucideIcon;
    label: string;
    required?: boolean;
    error?: boolean;
    children: ReactNode;
};

function Campo({ icon: Icon, label, required, error, children }: CampoProps) {
    return (
        <div>
            <label className="af-label">
                <Icon size={14} strokeWidth={2} className="af-label-icon" />
                {label}
                {required && <span className="af-required"> *</span>}
            </label>
            {children}
            {error && <p className="af-error">Preencha este campo para continuar.</p>}
        </div>
    );
}

export default function Agendamento() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [servico, setServico] = useState('');
    const [tentouEnviar, setTentouEnviar] = useState(false);
    const [confirmado, setConfirmado] = useState(false);
    const [servicoId, setServicoId] = useState(1);
    const [valor, setValor] = useState(35.00);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([''])

    const obrigatoriosOk = Boolean(nome.trim() && telefone.trim() && endereco.trim() && data && horario);
    const erro = (valor: string | boolean): boolean => tentouEnviar && !valor;

    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setTentouEnviar(true);
        if (obrigatoriosOk) setConfirmado(true);
    }

    function handleNovoAgendamento(): void {
        setNome('');
        setTelefone('');
        setEndereco('');
        setData('');
        setHorario('');
        setServico('');
        setTentouEnviar(false);
        setConfirmado(false);
    }

    async function handlePOST() {
        if (!obrigatoriosOk) {
            return
        }
        try {
            const res = await api.post('/api/agendamento', {
                nome: nome,
                telefone: telefone,
                endereco: endereco,
                servico_id: servicoId,
                data: data,              // formato: "2026-08-15"
                hora: horario,              // formato: "10:00"
                valor_na_epoca: valor
            });

            console.log(res.data); // vai mostrar: { mensagem: "Agendamento criado com sucesso!", ... }

        } catch (error) {
            console.error(error);
        }
    }

    // requisição para obter as horas já cadastradas
    useEffect(() => {
        async function GetHorario() {
            if(!data) return
             try {
                const res = await api.get(`/api/horario_disponivel?data=${data}`); // res.data vem assim: [{hora:"08:00:00"}, {hora:"10:00:00"}]
                const horariosAgendados = res.data.map((item: any) => item.hora.slice(0, 5)); // transforma em ["08:00", "10:00"]
                const disponiveis = HORARIOS.filter(item => !horariosAgendados.includes(item))  // compara com a lista fixa
                setHorariosDisponiveis(disponiveis)
                console.log(disponiveis);   

            } catch (error) {
                console.log('erro de horario' + error);
            }
        }
        GetHorario()
    }, [data])


    // pegando o dia atual
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataMinima = `${ano}-${mes}-${dia}`;

    return (
        <div className="af-page">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Space+Grotesk:wght@400;500;600&display=swap');

        .af-page {
          min-height: 100vh;
          width: 100%;
          background-color: #E7E2D3;
          background-image: radial-gradient(circle at 1px 1px, rgba(32,42,34,0.07) 1px, transparent 0);
          background-size: 22px 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .af-card {
          width: 100%;
          max-width: 560px;
          background-color: #FAF8F2;
          border-radius: 4px;
          padding: 3rem 2.75rem;
          box-shadow: 0 30px 60px -25px rgba(32,42,34,0.35);
        }
        @media (max-width: 480px) {
          .af-card { padding: 2.25rem 1.5rem; }
        }
        .af-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #AD8A4E;
          font-weight: 600;
          margin-bottom: 0.6rem;
        }
        .af-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 2.15rem;
          color: #202A22;
          line-height: 1.05;
          margin-bottom: 0.5rem;
        }
        .af-subtitle {
          color: #6B7566;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          max-width: 42ch;
        }
        .af-section-title {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #202A22;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin: 2rem 0 1.25rem;
        }
        .af-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: #D8D2C0;
        }
        .af-section-title:first-of-type { margin-top: 0; }
        .af-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #5B6B57;
          margin-bottom: 0.55rem;
        }
        .af-label-icon { color: #AD8A4E; flex-shrink: 0; }
        .af-required { color: #B14B3A; }
        .af-input, .af-select {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid #D8D2C0;
          padding: 0.5rem 0.1rem 0.6rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.98rem;
          color: #202A22;
          outline: none;
          transition: border-color 0.2s ease;
          appearance: none;
          border-radius: 0;
        }
        .af-input::placeholder { color: #A9A390; }
        .af-input:focus, .af-select:focus { border-color: #AD8A4E; }
        .af-input.af-invalid, .af-select.af-invalid { border-color: #B14B3A; }
        .af-error { margin-top: 0.4rem; font-size: 0.72rem; color: #B14B3A; }
        .af-select-wrap { position: relative; }
        .af-select-chevron {
          position: absolute;
          right: 0.15rem;
          top: 50%;
          transform: translateY(-70%);
          pointer-events: none;
          color: #AD8A4E;
        }
        .af-grid { display: grid; grid-template-columns: 1fr; gap: 1.6rem; }
        @media (min-width: 480px) {
          .af-grid-2 { grid-template-columns: 1fr 1fr; }
        }
        .af-submit {
          margin-top: 2.4rem;
          width: 100%;
          background-color: #202A22;
          color: #F1EEE3;
          border: none;
          padding: 0.9rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .af-submit:hover { background-color: #33402F; }
        .af-submit:focus-visible { outline: 2px solid #AD8A4E; outline-offset: 3px; }
        .af-banner {
          margin-bottom: 1.75rem;
          padding: 0.85rem 1rem;
          background-color: rgba(173,138,78,0.12);
          border-left: 3px solid #AD8A4E;
          font-size: 0.82rem;
          color: #59502F;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .af-banner-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #AD8A4E;
          color: #FAF8F2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .af-banner-actions { margin-left: auto; }
        .af-banner button {
          background: none;
          border: none;
          color: #AD8A4E;
          font-weight: 600;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          white-space: nowrap;
        }
        @media (prefers-reduced-motion: reduce) {
          .af-submit, .af-input, .af-select { transition: none; }
        }
      `}</style>

            <div className="af-card">
                <div className="af-eyebrow">Ficha de agendamento</div>
                <h1 className="af-title">Agendamento</h1>
                <p className="af-subtitle">Preencha os dados abaixo para reservar seu horário. Os campos marcados com * são obrigatórios.</p>

                {confirmado && (
                    <div className="af-banner">
                        <span className="af-banner-icon"><Check size={12} strokeWidth={3} /></span>
                        <span>Agendamento confirmado.</span>
                        <span className="af-banner-actions">
                            <button type="button" onClick={handleNovoAgendamento}>Novo agendamento</button>
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="af-section-title">Seus dados</div>
                    <div className="af-grid">
                        <Campo icon={User} label="Nome" required error={erro(nome.trim())}>
                            <input
                                className={`af-input ${erro(nome.trim()) ? 'af-invalid' : ''}`}
                                type="text"
                                placeholder="Seu nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Campo>

                        <div className="af-grid af-grid-2">
                            <Campo icon={Phone} label="Telefone" required error={erro(telefone.trim())}>
                                <input
                                    className={`af-input ${erro(telefone.trim()) ? 'af-invalid' : ''}`}
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={telefone}
                                    onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                />
                            </Campo>

                            <Campo icon={MapPin} label="Endereço" required error={erro(endereco.trim())}>
                                <input
                                    className={`af-input ${erro(endereco.trim()) ? 'af-invalid' : ''}`}
                                    type="text"
                                    placeholder="Rua, número, bairro"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                />
                            </Campo>
                        </div>
                    </div>

                    <div className="af-section-title">Horário desejado</div>
                    <div className="af-grid">
                        <div className="af-grid af-grid-2">
                            <Campo icon={CalendarDays} label="Data" required error={erro(data)}>
                                <input
                                    className={`af-input ${erro(data) ? 'af-invalid' : ''}`}
                                    type="date"
                                    min={dataMinima}
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                />
                            </Campo>

                            <Campo icon={Clock3} label="Horário" required error={erro(horario)}>
                                <div className="af-select-wrap">
                                    <select
                                        className={`af-select ${erro(horario) ? 'af-invalid' : ''}`}
                                        value={horario}
                                        onChange={(e) => setHorario(e.target.value)}
                                    >
                                        <option value="">Selecione</option>
                                        {horariosDisponiveis.map((h) => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="af-select-chevron" />
                                </div>
                            </Campo>
                        </div>

                        <Campo icon={Sparkles} label="Serviço">
                            <div className="af-select-wrap">
                                <select
                                    className="af-select"
                                    value={servico}
                                    onChange={(e) => setServico(e.target.value)}
                                >
                                    <option value="">
                                        {SERVICOS.length ? 'Selecione um serviço' : 'A definir'}
                                    </option>
                                    {SERVICOS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="af-select-chevron" />
                            </div>
                        </Campo>
                    </div>

                    <button type="submit" className="af-submit" onClick={handlePOST}>Confirmar agendamento</button>
                </form>
            </div>
        </div>
    );
}
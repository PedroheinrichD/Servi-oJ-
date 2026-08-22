"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  User,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  Sparkles,
  ChevronDown,
  Check,
  type LucideIcon,
} from "lucide-react";
import { api } from "@/utils/api";
import { serviceGetType } from "@/types/serviceGetType";

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const meio = digitos.slice(2, 7);
  const fim = digitos.slice(7, 11);
  let saida = "";
  if (ddd) saida = `(${ddd}`;
  if (ddd.length === 2) saida += ") ";
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
    <div className="af-field-group">
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
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [servicoValueId, setServicoValueId] = useState("");
  const [SERVICOS, setSERVICOS] = useState<serviceGetType[]>([]);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([""]);

  const obrigatoriosOk = Boolean(
    nome.trim() &&
    telefone.trim() &&
    endereco.trim() &&
    data &&
    horario &&
    servicoValueId,
  );
  const erro = (valor: string | boolean): boolean => tentouEnviar && !valor;

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setTentouEnviar(true);
    if (obrigatoriosOk) setConfirmado(true);
  }

  function handleNovoAgendamento(): void {
    setNome("");
    setTelefone("");
    setEndereco("");
    setServicoValueId("");
    setData("");
    setHorario("");
    setTentouEnviar(false);
    setConfirmado(false);
  }

  async function handlePOST() {
    if (!obrigatoriosOk) {
      return;
    }
    try {
      const resultado = SERVICOS.find(
        (item) => item.id === Number(servicoValueId),
      );
      await api.post("/api/agendamento", {
        nome: nome,
        telefone: telefone,
        endereco: endereco,
        servico_id: servicoValueId,
        data: data,
        hora: horario,
        valor_na_epoca: resultado?.valor,
      });

      setTimeout(() => {
        handleNovoAgendamento();
      }, 4000);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function GetHorario() {
      if (!data) return;
      try {
        const res = await api.get(`/api/horario_disponivel?data=${data}`);
        const horariosAgendados = res.data.map((item: { hora: string }) =>
          item.hora.slice(0, 5),
        );
        const disponiveis = HORARIOS.filter(
          (item) => !horariosAgendados.includes(item),
        );
        setHorariosDisponiveis(disponiveis);
      } catch (error) {
        console.log("erro de horario" + error);
      }
    }
    GetHorario();
  }, [data]);

  useEffect(() => {
    async function solicitaServico() {
      try {
        const res = await api.get("/api/servico");
        if (res === null) return;
        setSERVICOS(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    solicitaServico();
  }, []);

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  const dataMinima = `${ano}-${mes}-${dia}`;

  return (
    <div className="af-page">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700&display=swap');

                .af-page {
                    min-height: 100vh;
                    width: 100%;
                    background-color: #FBF9F4;
                    background-image: 
                        linear-gradient(135deg, rgba(36, 47, 41, 0.04) 0%, transparent 42%),
                        linear-gradient(315deg, rgba(115, 90, 58, 0.05) 0%, transparent 38%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1.25rem;
                    font-family: 'Manrope', sans-serif;
                }

                .af-card {
                    width: 100%;
                    max-width: 680px;
                    background: #FFFFFF;
                    border: 1px solid #C3C8C3;
                    border-radius: 2px;
                    padding: 3.5rem 3rem;
                    box-shadow: 0 18px 45px rgba(27, 28, 25, 0.07);
                    position: relative;
                    overflow: hidden;
                }

                .af-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background: #735A3A;
                }

                @media (max-width: 640px) {
                    .af-card { 
                        padding: 2.5rem 1.75rem; 
                        border-radius: 0;
                    }
                    .af-page { padding: 1.5rem 1rem; }
                }

                .af-eyebrow {
                    font-size: 0.7rem;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: #735A3A;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    font-family: 'Manrope', sans-serif;
                }

                .af-title {
                    font-family: 'DM Serif Display', Georgia, serif;
                    font-weight: 400;
                    font-size: 2.75rem;
                    color: #1B1C19;
                    line-height: 1.1;
                    margin-bottom: 0.6rem;
                    letter-spacing: 0;
                }

                .af-subtitle {
                    color: #434844;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                    max-width: 45ch;
                    font-weight: 400;
                }

                .af-section-title {
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #1C1917;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 2.5rem 0 1.5rem;
                    font-family: 'Manrope', sans-serif;
                }

                .af-section-title::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #C3C8C3 0%, transparent 100%);
                }

                .af-section-title:first-of-type { margin-top: 0; }

                .af-field-group { margin-bottom: 0.25rem; }

                .af-label {
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #78716C;
                    margin-bottom: 0.65rem;
                    font-family: 'Manrope', sans-serif;
                }

                .af-label-icon { 
                    color: #735A3A; 
                    flex-shrink: 0;
                    opacity: 0.9;
                }

                .af-required { color: #DC2626; font-weight: 700; }

                .af-input, .af-select {
                    width: 100%;
                  background: #F5F3EE;
                  border: 1px solid #C3C8C3;
                  border-radius: 0;
                    padding: 0.85rem 1rem;
                    font-size: 0.95rem;
                    color: #1B1C19;
                    outline: none;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Manrope', sans-serif;
                    font-weight: 400;
                }

                .af-input::placeholder { color: #737874; font-weight: 400; }

                .af-input:hover, .af-select:hover {
                    border-color: #735A3A;
                    background: #FFFFFF;
                }

                .af-input:focus, .af-select:focus {
                    border-color: #735A3A;
                    background: #FFFFFF;
                    box-shadow: 0 0 0 3px rgba(115, 90, 58, 0.14);
                }

                .af-input.af-invalid, .af-select.af-invalid {
                    border-color: #BA1A1A;
                    background: #FFF5F3;
                }

                .af-input.af-invalid:focus, .af-select.af-invalid:focus {
                    box-shadow: 0 0 0 3px rgba(186, 26, 26, 0.12);
                }

                .af-error { 
                    margin-top: 0.5rem; 
                    font-size: 0.75rem; 
                    color: #BA1A1A;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    animation: af-slideIn 0.3s ease;
                }

                .af-error::before {
                    content: '';
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #BA1A1A;
                    display: inline-block;
                }

                .af-select-wrap { position: relative; }

                .af-select {
                    cursor: pointer;
                    appearance: none;
                    padding-right: 2.5rem;
                }

                .af-select-chevron {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: #735A3A;
                    transition: transform 0.2s ease;
                }

                .af-select-wrap:focus-within .af-select-chevron {
                    transform: translateY(-50%) rotate(180deg);
                }

                .af-grid { 
                    display: grid; 
                    grid-template-columns: 1fr; 
                    gap: 1.25rem; 
                }

                @media (min-width: 560px) {
                    .af-grid-2 { grid-template-columns: 1fr 1fr; }
                }

                .af-submit {
                    margin-top: 2.5rem;
                    width: 100%;
                    background: #242F29;
                    color: #FFFFFF;
                    border: none;
                    padding: 1rem 1.5rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border-radius: 0;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Manrope', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .af-submit::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
                    transition: left 0.5s ease;
                }

                .af-submit:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(36, 47, 41, 0.2);
                }

                .af-submit:hover::after {
                    left: 100%;
                }

                .af-submit:active {
                    transform: translateY(0);
                }

                .af-submit:focus-visible { 
                    outline: 2px solid #735A3A; 
                    outline-offset: 3px; 
                }

                .af-banner {
                  position: fixed;
                  top: 1.5rem;
                  left: 50%;
                  z-index: 20;
                  width: min( calc(100% - 2rem), 680px );
                  transform: translateX(-50%);
                    padding: 1rem 1.25rem;
                    background: #F0EEE9;
                    border: 1px solid #C3C8C3;
                    border-radius: 0;
                    font-size: 0.9rem;
                    color: #434844;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    animation: af-slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                  @media (max-width: 640px) {
                    .af-banner {
                      top: 1rem;
                      width: calc(100% - 2rem);
                    }
                  }

                .af-banner-icon {
                    flex-shrink: 0;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #735A3A;
                    color: #FFFFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .af-banner-actions { margin-left: auto; }

                .af-banner button {
                    background: none;
                    border: none;
                    color: #735A3A;
                    font-weight: 600;
                    font-size: 0.72rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                    white-space: nowrap;
                    padding: 0.35rem 0.75rem;
                    border-radius: 0;
                    transition: all 0.2s ease;
                }

                .af-banner button:hover {
                    background: #E4E2DD;
                    color: #1B1C19;
                }

                @keyframes af-slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .af-submit, .af-input, .af-select, .af-banner, .af-error { 
                        transition: none; 
                        animation: none;
                    }
                }

                /* Estilização nativa do input date */
                input[type="date"].af-input::-webkit-calendar-picker-indicator {
                    opacity: 0.5;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }

                input[type="date"].af-input::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>

      <div className="af-card">
        <div className="af-eyebrow">Ficha de agendamento</div>
        <h1 className="af-title">Agendamento</h1>
        <p className="af-subtitle">
          Preencha os dados abaixo para reservar seu horário. Os campos marcados
          com * são obrigatórios.
        </p>

        {confirmado && (
          <div className="af-banner">
            <span className="af-banner-icon">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>Agendamento confirmado.</span>
            <span className="af-banner-actions">
              <button type="button" onClick={handleNovoAgendamento}>
                Novo agendamento
              </button>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="af-section-title">Seus dados</div>
          <div className="af-grid">
            <Campo icon={User} label="Nome" required error={erro(nome.trim())}>
              <input
                className={`af-input ${erro(nome.trim()) ? "af-invalid" : ""}`}
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Campo>

            <div className="af-grid af-grid-2">
              <Campo
                icon={Phone}
                label="Telefone"
                required
                error={erro(telefone.trim())}
              >
                <input
                  className={`af-input ${erro(telefone.trim()) ? "af-invalid" : ""}`}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(formatarTelefone(e.target.value))
                  }
                />
              </Campo>

              <Campo
                icon={MapPin}
                label="Endereço"
                required
                error={erro(endereco.trim())}
              >
                <input
                  className={`af-input ${erro(endereco.trim()) ? "af-invalid" : ""}`}
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
              <Campo
                icon={CalendarDays}
                label="Data"
                required
                error={erro(data)}
              >
                <input
                  className={`af-input ${erro(data) ? "af-invalid" : ""}`}
                  type="date"
                  min={dataMinima}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </Campo>

              <Campo
                icon={Clock3}
                label="Horário"
                required
                error={erro(horario)}
              >
                <div className="af-select-wrap">
                  <select
                    className={`af-select ${erro(horario) ? "af-invalid" : ""}`}
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    {horariosDisponiveis.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="af-select-chevron" />
                </div>
              </Campo>
            </div>

            <Campo
              icon={Sparkles}
              label="Serviço"
              required
              error={erro(horario)}
            >
              <div className="af-select-wrap">
                <select
                  className={`af-select ${erro(servicoValueId) ? "af-invalid" : ""}`}
                  value={servicoValueId}
                  onChange={(e) => setServicoValueId(e.target.value)}
                >
                  <option value="">
                    {SERVICOS ? "Selecione um serviço" : "Carregando serviços"}
                  </option>
                  {SERVICOS.map((s) => (
                    <option key={s.id} value={s.id}>
                      R${s.valor} - {s.nome}{" "}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="af-select-chevron" />
              </div>
            </Campo>
          </div>

          <button type="submit" className="af-submit" onClick={handlePOST}>
            Confirmar agendamento
          </button>
        </form>
      </div>
    </div>
  );
}

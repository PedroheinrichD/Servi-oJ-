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

        const servicoId = new URLSearchParams(window.location.search).get(
          "servicoId",
        );
        if (
          servicoId &&
          res.data.some(
            (item: serviceGetType) => String(item.id) === servicoId,
          )
        ) {
          setServicoValueId(servicoId);
        }
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700&display=swap');`}</style>
      <div>
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

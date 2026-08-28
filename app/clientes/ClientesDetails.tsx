import { clienteType } from "@/types/clienteType"
import { api } from "@/utils/api"
import { Check, CreditCard, MapPin, Phone, X } from "lucide-react"
import Link from "next/link"

type detailsProps = {
  closeModal: () => void
  loadClientes: () => void
  result: clienteType[]
}


export function ClienteDetails({ closeModal, result, loadClientes }: detailsProps) {

  async function concluirAgendamento(id: number){
    try{
      const req = await api.put('/api/status',{
        agendamento_id: id,
        status: 'Atendido'
      })
      closeModal();
      loadClientes();
    }catch{
      console.log('erro aqui no envio do ID');
    }
  }

  async function cancelarAgendamento(id: number){
    try{
      await api.put('/api/status',{
        agendamento_id: id,
        status: 'Cancelado'
      })

      const cliente = result.find((item) => item.agendamento_id === id);
      if (cliente?.token_cancelamento) {
        localStorage.setItem(
          "servioj:ticket-agendamento",
          JSON.stringify({
            ticket: {
              nome: cliente.cliente_nome,
              data: cliente.data,
              horario: cliente.hora,
              servico: cliente.servico_nome,
              canceladoPorAdmin: true,
            },
            tokenCancelamento: cliente.token_cancelamento,
          }),
        );
      }

      closeModal();
      loadClientes();
    }catch{
      console.log('erro aqui no envio do ID');
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      {result.map((c) => (
        <div
          key={c.agendamento_id}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-white/70 bg-[#fbf9f4] shadow-2xl"
        >
          {/* sair botao */}
          <div className="relative border-b border-[#e4e2dd] bg-[#242f29] px-6 pb-6 pt-5 text-white">
            <button
              aria-label="Fechar"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#bdcac1]">Atendimento</p>
            <h2 className="pr-10 text-2xl font-bold tracking-tight">{c.cliente_nome}</h2>
            <p className="mt-1 text-sm text-[#d9e6dc]">{c.servico_nome}</p>
          </div>

          {/* Conteúdo */}
          <div className="px-6 pb-6 pt-5">
            <div className="flex items-center justify-between border-b border-[#e4e2dd] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#737874]">Valor a receber</p>
                <p className="mt-1 text-xl font-bold text-[#1b1c19]">R$ {c.valor_na_epoca}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fddab2] text-[#785e3e]">
                <CreditCard size={18} />
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.endereco}, Itápolis, SP, Brasil`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-[#e4e2dd] bg-white p-3 text-sm text-[#434844] transition hover:border-[#735a3a] hover:bg-[#f5f3ee]"
              >
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#735a3a]" />
                <span className="leading-relaxed underline underline-offset-2">{c.endereco}</span>
              </Link>

              <a
                href={`tel:${c.telefone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 rounded-xl border border-[#e4e2dd] bg-white p-3 text-sm text-[#434844] transition hover:border-[#735a3a] hover:bg-[#f5f3ee]"
              >
                <Phone size={18} className="shrink-0 text-[#735a3a]" />
                {c.telefone}
              </a>
            </div>

            {/* Ações */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => concluirAgendamento(c.agendamento_id)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#101a15] py-3 text-sm font-semibold text-white transition hover:bg-[#30312e]">
                <Check size={20} />
                Concluir
              </button>
              <button onClick={() => cancelarAgendamento(c.agendamento_id)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#ba1a1a]/30 py-3 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]/40">
                <X size={20} />
                Cancelar
              </button>
            </div>

            <button
              className="mt-4 w-full text-center text-xs font-bold uppercase tracking-wider text-[#737874] transition hover:text-[#1b1c19]"
              onClick={closeModal}
            >
              FECHAR
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
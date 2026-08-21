import { serviceType } from "@/types/serviceType";
import { CreditCard, Pencil, Trash2, X } from "lucide-react";
import ImageCarousel from "./ImageCarousel";


type detailsProps = {
  servicedetails: serviceType[]
  closeDetails: () => void
}

export default function ServiceDetailsModal({ servicedetails, closeDetails }: detailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 h-full">
      {servicedetails.map((s) => (
        <div key={s.id} className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Imagens */}
          <div className="relative">
            <ImageCarousel
              images={s.lista_url.split(",")}
              alt={s.nome}
              intervalMs={3000}
            />
            <button
              aria-label="Fechar"
              onClick={closeDetails}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="px-5 pb-5 pt-4">
            <h2 className="text-xl font-bold text-gray-900">{s.nome}</h2>

            {/* Badges */}
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                <CreditCard size={13} />
                R$ {s.valor}
              </span>
            </div>

            {/* Descrição */}
            <div className="mt-5">
              <h3 className="text-xs font-bold tracking-wide text-gray-500">
                DESCRIÇÃO
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {s.descricao}
              </p>
            </div>

            {/* Ações */}
            <div className="mt-6 flex flex-col gap-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                <Pencil size={15} />
                EDITAR SERVIÇO
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                <Trash2 size={15} />
                EXCLUIR SERVIÇO
              </button>
            </div>

            <button
              className="mt-4 w-full text-center text-sm font-medium text-gray-400 transition hover:text-gray-600"
              onClick={closeDetails}
            >
              FECHAR
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
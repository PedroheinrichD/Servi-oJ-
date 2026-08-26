import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

export default function Clientes() {
    return (
        <div className="space-y-7">
            {/* Header */}
            < header className="mx-auto max-w-3xl px-6 mt-8" >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="mt-1 font-serif text-4xl font-light text-[#1c1917]">
                            Clientes
                        </h1>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-textTitle">
                            agendamentos
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white text-[#78716c] transition-all hover:border-[#d6d3d1] hover:text-[#1c1917] hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                </div>
                <div className="bg-gray-300 w-full h-[0.01rem]" />
            </header >


            {/* filters */}
            <nav className="mr-8 mt-4">
                <ul className="flex justify-end gap-2">
                    <li className="border rounded-full px-4 py-1 bg-black text-white text-[0.9rem]">Hoje</li>
                    <li className="group relative isolate overflow-hidden rounded-full border border-gray-400 px-4 py-1 text-[0.9rem] transition-colors duration-300 hover:text-white before:absolute before:inset-y-0 before:left-0 before:-z-10 before:w-0 before:bg-black before:transition-[width] before:duration-500 before:ease-out hover:before:w-full">
                        <span className="relative z-10">Todos</span>
                    </li>
                </ul>
            </nav>

            <main className="bg-[#faf9f7] text-[#1c1917] px-5 flex flex-col items-center gap-8">
                
                {/* Clients List */}
                <div className="w-full max-w-[420px] rounded-lg border-l-4 border-[#8b7355] bg-[#eae8e3] p-5 shadow-md md:max-w-2xl">
                    {/* Linha superior */}
                    <div className="flex items-start justify-between mb-4 gap-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-[#1a1a1a] truncate">
                                Carlos da Silva Moreira de Tal
                            </h3>
                            <p className="text-sm text-[#666666] mt-0.5 truncate">
                                Massagem Relaxante com Aromaterapia e Pedras Quentes
                            </p>
                        </div>

                        <div className="shrink-0 bg-white border border-[#d4d0c8] rounded px-3 py-1.5 text-sm font-medium text-[#333333]">
                            10:00 AM
                        </div>
                    </div>

                    {/* Divisor */}
                    <div className="border-t border-[#c8c4bc] my-3" />

                    {/* Linha inferior */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#5a5a5a]">
                           <Clock width={16} height={16}/>
                            <span className="text-sm">Pendente</span>
                        </div>
                        <button className="text-sm text-[#1a1a1a] underline underline-offset-2 hover:text-[#555555] transition-colors">
                            Detalhes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )

}
/* Modal de detalhes

      {isModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          <ServiceDetailsModal
            handleDelete={handleDelete}
            handleEdit={showEdit}
            closeDetails={closeDetails}
            servicedetails={servicesDetails}
          />
        </div>
      )}*/
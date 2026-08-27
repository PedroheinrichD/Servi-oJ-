"use client"
import { useKeyboard } from "@/hooks/useKeyboard";
import { clienteType } from "@/types/clienteType";
import { api } from "@/utils/api";
import { ArrowLeft, CircleCheck, Clock, LayoutDashboard, UsersRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import { ClienteDetails } from "./ClientesDetails";

export default function Clientes() {
    const isKeyboardOpen = useKeyboard();  // hook

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const dataMinima = `${ano}-${mes}-${dia}`;

    const [data, setData] = useState(dataMinima)
    const [clientes, setClientes] = useState<clienteType[]>([])
    const [isModal, setIsModal] = useState(false)
    const [result, setResult] = useState<clienteType[]>([])
    const [statusFilter, setStatusFilter] = useState("aguardando")

    useEffect(() => {
        async function handleGetClientes() {
            const url = data
                ? `/api/clientes?data=${data}&status=${statusFilter}`
                : 'api/clientes'

            const req = await api.get(url)
            setClientes(req.data)
        }
        handleGetClientes()
    }, [data, statusFilter])


    // carregar clientes após status mudar
    async function loadClientes() {
        const url = data
            ? `/api/clientes?data=${data}&status=${statusFilter}`
            : 'api/clientes'

        const req = await api.get(url)
        setClientes(req.data)
    }

    function handleCloseModal() {
        setIsModal(false)
    }

    async function handleDetails(id: number) {
        setIsModal(true)

        const filter = await clientes.filter(item => item.cliente_id === id)
        setResult(filter)
    }


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
                    <li>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("Atendido")}
                            className={`rounded-full border px-4 py-1 text-[0.9rem] transition-colors ${statusFilter === "Atendido" ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                        >
                            Atendidos
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("Cancelado")}
                            className={`rounded-full border px-4 py-1 text-[0.9rem] transition-colors ${statusFilter === "Cancelado" ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                        >
                            Cancelados
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"

                            onClick={() => setStatusFilter("aguardando")}                            className={`rounded-full border px-4 py-1 text-[0.9rem] transition-colors ${statusFilter === "aguardando" ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                        >
                            Aguardando
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="text-end ">
                <input
                    className="mr-7 border  border-[#C3C8C3] bg-[#F5F3EE] rounded-md p-2"
                    type="date"
                    min={dataMinima}
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
            </div>

            {/* Modal de detalhes */}
            {isModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                    <ClienteDetails
                        closeModal={handleCloseModal}
                        result={result}
                        loadClientes={loadClientes}
                    />
                </div>
            )}


            <main className="bg-[#faf9f7] text-[#1c1917] px-5 mb-20 flex flex-col items-center gap-4">
                {/* Clients List */}
                {clientes.map((c) => (
                    <div key={c.agendamento_id} className={`w-full max-w-[420px] rounded-lg border-l-4 ${c.status === "Atendido" ? "border-[#5d8d68]" : c.status === "Cancelado" ? "border-[#ba1a1a]" : "border-[rgb(139,115,85)]"} bg-[#eae8e3] p-5 shadow-md md:max-w-2xl`}>
                        {/* Linha superior */}
                        <div className="flex items-start justify-between mb-4 gap-3">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-semibold text-[#1a1a1a] truncate">
                                    {c.cliente_nome}
                                </h3>
                                <p className="text-sm text-[#666666] mt-0.5 truncate">
                                    {c.servico_nome}
                                </p>
                            </div>

                            <div className="shrink-0 bg-white border border-[#d4d0c8] rounded px-3 py-1.5 text-sm font-medium text-[#333333]">
                                {c.hora.slice(0, 5)}
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="border-t border-[#c8c4bc] my-3" />

                        {/* Linha inferior */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#5a5a5a]">
                                {statusFilter === 'Atendido' ? <CircleCheck width={16} height={16} /> : <Clock width={16} height={16} />}
                                
                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "Atendido" ? "bg-[#d9e6dc] text-[#3e4943]" : c.status === "Cancelado" ? "bg-[#ffdad6] text-[#93000a]" : "bg-[#fddab2] text-[#785e3e]"}`}>
                                    {c.status}
                                </span>
                            </div>
                            <button onClick={() => handleDetails(c.cliente_id)} className="text-sm text-[#1a1a1a] underline underline-offset-2 hover:text-[#555555] transition-colors">
                                Detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </main>

            {/* nav */}
            <footer className={`w-full flex fixed bottom-0 ${isKeyboardOpen ? 'hidden' : 'block'}`}>
                <Link href={'/painel'} className="flex flex-1 flex-col items-center justify-center py-2 bg-footer-NAV transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_-4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98]">
                    <LayoutDashboard width={25} height={25} id="painel" />
                    <label className="text-[0.8rem] mt-2" htmlFor="painel">
                        Painel
                    </label>
                </Link>

                <div className="flex flex-1 flex-col items-center justify-center bg-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_-4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98]">
                    <UsersRound width={25} height={25} id="clientes" />
                    <label className="text-[0.8rem] mt-2" htmlFor="clientes">
                        Clientes
                    </label>
                </div>
            </footer>
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
import { Button } from "@/components/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Painel() {
  return (
    <main className="p-6 space-y-16 bg-bgAll min-h-screen">
      <Link href="/" className=" absolute top-10 right-5">
        <ArrowLeft />
      </Link>

      <header className="flex flex-col">
        <h3 className="text-textTitle">BOM DIA,</h3>
        <h1 className="text-3xl font-semibold font-title">Caroline</h1>
      </header>

      <div>
        <h3 className="uppercase">visão geral</h3>
        <div className="h-px w-full bg-bgMilitar mt-2" />
      </div>

      <section className="border border-borderBox rounded-lg px-4 py-4 space-y-4">
        {/*seção para adicionar serviços UI*/}
        <div>
          <h3 className="text-[1.60rem] font-semibold font-title">
            Gerenciar serviços
          </h3>
          <p className="text-[0.875rem]">
            Adicione, edite ou remova os serviços disponíveis no catálogo.
          </p>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="nomeServico"
            className="uppercase text-textLabel text-[0.875rem] font-medium mb-0.5"
          >
            nome do servico
          </label>
          <input
            type="text"
            name="nomeServico"
            id="nomeServico"
            placeholder="EX.: pacote de unhas"
            className="bg-bgInput border border-borderBox rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="precoServico"
            className="uppercase text-textLabel text-[0.875rem] font-medium mb-0.5"
          >
            preco (R$)
          </label>
          <input
            type="number"
            name="precoServico"
            id="precoServico"
            placeholder="EX.: 100,00"
            className="bg-bgInput border border-borderBox rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="descricaoServico"
            className="uppercase text-textLabel text-[0.875rem] font-medium mb-0.5"
          >
            descrição
          </label>
          <textarea
            name="descricaoServico"
            id="descricaoServico"
            placeholder="EX.: neste pacote você terá direito a..."
            className="bg-bgInput border border-borderBox rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 h-32"
          ></textarea>
        </div>

        <Button name="Adicionar Serviço" />

        {/*seção de listagem dos serviços adicionados UI*/}
        <section className="border bg-bgInput border-borderBox rounded-lg px-4 py-4 space-y-4">
          <div className="flex justify-between">
            <h3 className="text-[1rem] font-semibold">nome do serviço</h3>
            <div className="flex gap-4">
              <Pencil height={20} className="hover:stroke-blue-500 cursor-pointer"/>
              <Trash2 height={20} className="hover:stroke-red-500 cursor-pointer"/>
            </div>
          </div>

          <div className="flex justify-between">
            <p>preço</p>
            <p>R$ 100,00</p>
          </div>
        </section>
      </section>
    </main>
  );
}

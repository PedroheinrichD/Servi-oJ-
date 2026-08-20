"use client"
import { Button } from "@/components/button";
import { serviceType } from "@/types/serviceType";
import { api } from "@/utils/api";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function Painel() {
  const inputRef = useRef<HTMLInputElement>(null) // referencia para o input to tipo file
  const [images, setImages] = useState<string[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState<string[]>([])
  const [nome, setNome] = useState('') // nome do servico
  const [descricao, setDescricao] = useState('') // descrição do servico
  const [valor, setValor] = useState('') // valor do servico
  const valueAsNumber = Number(valor) // conversão para numero

  const [services, setServices] = useState<serviceType[]>([])// guarda todos os servico



  async function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const urls: string[] = [] // é do tipo array de string e começa vazio
    const nomes: string[] = [] // é do tipo array de string e começa vazio
    const files = event.target.files

    if (!files) return

      // req para enviar as fotos e devolver o link delas
    for (const file of Array.from(files)) { // loop percorre a minha lista files e a cada iteração vai adicionando ao array de string urls que depois adiciona ao state
      // mandar um formulario de dados
      const data = new FormData();

      data.append("file", file)
      data.append("upload_preset", "fotos_admin")

      const req = await fetch("https://api.cloudinary.com/v1_1/gomwgnhb/image/upload", {
        method: "POST",
        body: data
      })
      const uploadImageUrl = await req.json();

      urls.push(uploadImageUrl.url)
      nomes.push(uploadImageUrl.display_name)
    }

    setNomeArquivo(nomes)
    setImages(urls)
  }

  // req para enviar dados dos servicos
  async function handleAddService() {
    try {
      const req = await api.post('/api/adicionar_servico', {
        nome: nome,
        descricao: descricao,
        valor: valueAsNumber,
      })
    } catch (error) {
      console.log(error);
    }
  }

  // req para obter dados dos servicos e listar
  useEffect(() => {
    async function handleGetService() {
      try {
        const req = await api.get('/api/servico');
        const result = await req.data;
        setServices(result)
      } catch (error) {
        console.log(error);
      }
    }
    handleGetService()
  }, [])


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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            value={valor}
            onChange={(e) => setValor(e.target.value)}
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
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            name="descricaoServico"
            id="descricaoServico"
            placeholder="EX.: neste pacote você terá direito a..."
            className="bg-bgInput border border-borderBox rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 h-32"
          ></textarea>
        </div>

        {/*seção para adicionar imagens*/}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="file"
            className="text-xs font-semibold uppercase tracking-wider text-[#4b4a45]"
          >
            Adicionar imagem
          </label>

          <div className="flex flex-col justify-center gap-3 rounded-md border border-[#dedad1] bg-[#f1efe9] px-3 py-2">
            <button
              onClick={() => inputRef.current?.click()}
              type="button"
              className="shrink-0 rounded-[4px] bg-[#23241f] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#33342d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23241f] focus-visible:ring-offset-2"
            >
              Escolher arquivo
            </button>

            <span className="text-center text-sm text-[#8a8579]">
              {nomeArquivo.length === 0
                ? 'Nenhuma imagem selecionada'
                : nomeArquivo.length === 1
                  ? nomeArquivo[0]
                  : `${nomeArquivo.length} imagens selecionadas`
              }
            </span>

            <input
              ref={inputRef}
              onChange={handleFileInput}
              multiple
              type="file"
              name="file"
              id="file"
              className="sr-only"
            />
          </div>
        </div>

        <Button onclick={handleAddService} name="Adicionar Serviço" />
      </section>

      <section className="flex flex-col gap-8">
        {services.map((s) => (
          <div key={s.nome} className="border bg-bgInput border-borderBox rounded-lg px-4 py-4 space-y-4">
            <div className="flex justify-between">
              <h3 className="text-[1rem] font-semibold">{s.nome}</h3>
              <div className="flex gap-4">
                <Pencil height={20} className="hover:stroke-blue-500 cursor-pointer" />
                <Trash2 height={20} className="hover:stroke-red-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex justify-between">
              <p>preço</p>
              <p>{s.valor}</p>
            </div>

            <div>
              <span className="text-sm text-[#8a8579]">
                {nomeArquivo.length === 0
                  ? 'Nenhuma imagem selecionada'
                  : nomeArquivo.length === 1
                    ? nomeArquivo[0]
                    : `${nomeArquivo.length} imagens selecionadas`
                }
              </span>
            </div>
            <span className="border-b">detalhes</span>
          </div>
        ))}
      </section>
    </main>
  );
}


/*
      -------seção de listagem dos serviços adicionados UI-------

      <section className="border bg-bgInput border-borderBox rounded-lg px-4 py-4 space-y-4">
        <div className="flex justify-between">
          <h3 className="text-[1rem] font-semibold">nome do serviço</h3>
          <div className="flex gap-4">
            <Pencil height={20} className="hover:stroke-blue-500 cursor-pointer" />
            <Trash2 height={20} className="hover:stroke-red-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-between">
          <p>preço</p>
          <p>R$ 100,00</p>
        </div>

        <div>
          <span className="text-sm text-[#8a8579]">
            {nomeArquivo.length === 0
              ? 'Nenhuma imagem selecionada'
              : nomeArquivo.length === 1
                ? nomeArquivo[0]
                : `${nomeArquivo.length} imagens selecionadas`
            }
          </span>
        </div>
        <span className="border-b">detalhes</span>
      </section>
*/
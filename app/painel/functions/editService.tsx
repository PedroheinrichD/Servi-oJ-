import { api } from "@/utils/api";

type editServiceProps = {
    id: number
    nome: string
    descricao: string
    valor: string
    images: string[]
}

export async function editService({ id, nome, descricao, valor, images }: editServiceProps) {
    await api.put('/api/editService', {
        id,
        nome,
        descricao,
        valor: Number(valor),
        url: images
    })
}
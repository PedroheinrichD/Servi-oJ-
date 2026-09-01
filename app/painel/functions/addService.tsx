import { api } from "@/utils/api"

type serviceProps = {
    nome: string,
    descricao: string,
    valor: string,
    setMessage: (message: string) => void,
    setSuccessful: (successful: boolean) => void,
    images?: string[]
}

export async function addService({ nome, descricao, valor, setMessage, setSuccessful, images }: serviceProps) {
    if (nome === '' || descricao === '' || valor === '') {
        setMessage('Campo vazio! Por favor preencha')
        return
    }
    const valueAsNumber = Number(valor)

    setMessage('')
    try {
        await api.post('/api/adicionar_servico', {
            nome: nome,
            descricao: descricao,
            valor: valueAsNumber,
            url: images,
        })

        setSuccessful(true)

    } catch (error) {
        console.log(error);
    } finally {

        setTimeout(() => {
            setSuccessful(false)
        }, 2000);
    }
}
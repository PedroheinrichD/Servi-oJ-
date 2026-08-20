import { api } from "@/utils/api"


type serviceProps = {
    nome: string,
    descricao: string,
    valor: string,
    setMessage: (message: string) => void,
    setSuccessful: (successful: boolean) => void
}

// req para enviar dados dos servicos
export async function addService({ nome, descricao, valor, setMessage, setSuccessful }: serviceProps) {
    if (nome === '' || descricao === '' || valor === '') {
        setMessage('Campo vazio! Por favor preencha')
        return
    }
    const valueAsNumber = Number(valor) // conversão para numero

    setMessage('')
    try {
        const req = await api.post('/api/adicionar_servico', {
            nome: nome,
            descricao: descricao,
            valor: valueAsNumber,
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

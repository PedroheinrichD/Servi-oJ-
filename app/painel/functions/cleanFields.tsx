type cleanFieldsProps = {
    setNome: (nome: string) => void
    setDescricao: (desc: string) => void
    setValor: (valor: string) => void
    setImages: (images: string[]) => void
    setNomeArquivo: (nomeArquivo: string[]) => void
}

export function cleanFields({ setNome, setDescricao, setValor, setImages, setNomeArquivo }: cleanFieldsProps) {
    setNome('')
    setDescricao('')
    setValor('')
    setImages([]);
    setNomeArquivo([]);
}
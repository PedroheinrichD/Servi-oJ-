  
  type handleFileInputProps = {
    event: React.ChangeEvent<HTMLInputElement>,
    setNomeArquivo: (nomeArquivo: string[]) => void,
    setImages: (images: string[]) => void
  }

  
  // req para enviar as fotos e devolver o link delas
  export async function fileInput({ event, setNomeArquivo, setImages }: handleFileInputProps) {
    const urls: string[] = [] // é do tipo array de string e começa vazio
    const nomes: string[] = [] // é do tipo array de string e começa vazio
    const files = event.target.files

    if (!files) return

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
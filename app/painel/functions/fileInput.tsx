type handleFileInputProps = {
    event: React.ChangeEvent<HTMLInputElement>,
    setNomeArquivo: (nomeArquivo: string[]) => void,
    setImages: (images: string[]) => void
  }

  export async function fileInput({ event, setNomeArquivo, setImages }: handleFileInputProps) {
    const urls: string[] = []
    const nomes: string[] = []
    const files = event.target.files

    if (!files) return

    for (const file of Array.from(files)) {
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
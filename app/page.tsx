"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-8">
      <Link href="/agendamento">agendar</Link>

      <Link href="/admin">admin</Link>

      <Link href="/painel">painel</Link>
    </div>
  );
}

/*

 req GET para exibir o serviço

  const [service, setService] = useState<serviceType[]>([])

  useEffect(() => {
    async function servicoDisponivel() {
      try {
        const res = await api.get('/api/servico')
        setService(res.data)
      } catch (error) {
        console.log(error);
      }
    }
    servicoDisponivel()
  }, [])

  return (
    <div>
      {service.map((item) => (
        <ul key={item.id}>
          <li>
            <p>{item.tempo_duracao}</p>
          </li>
        </ul>
      ))}
    </div>
  );
*/

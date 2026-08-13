"use client"
import { serviceType } from "@/types/serviceType";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import Agendamento from "./agendamento/Agendamento";

export default function Home() {
  return(
    <div>

    </div>
  )
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
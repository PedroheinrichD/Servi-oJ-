// app/agendamento/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { criarAgendamento, getHorariosAgendados } from "@/lib/queries";

export async function getHorariosDisponiveis(data: string) {
  const agendados = await getHorariosAgendados(data);
  const HORARIOS = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  const horariosAgendados = agendados.map((item) => item.hora.slice(0, 5));
  return HORARIOS.filter((h) => !horariosAgendados.includes(h));
}

export async function submitAgendamento(formData: FormData) {
  const nome = formData.get("nome") as string;
  const telefone = formData.get("telefone") as string;
  const endereco = formData.get("endereco") as string;
  const servico_id = Number(formData.get("servico_id"));
  const data = formData.get("data") as string;
  const hora = formData.get("hora") as string;
  const valor_na_epoca = Number(formData.get("valor_na_epoca"));

  try {
    await criarAgendamento({
      nome,
      telefone,
      endereco,
      servico_id,
      data,
      hora,
      valor_na_epoca,
    });

    revalidatePath("/agendamento");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível criar o agendamento.";
    return { success: false, error: message };
  }
}

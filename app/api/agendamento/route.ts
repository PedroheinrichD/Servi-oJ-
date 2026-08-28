import type { ResultSetHeader } from "mysql2/promise";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { nome, telefone, endereco, servico_id, data, hora, valor_na_epoca } =
    body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [resultadoCliente] = await connection.query(
      "INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)",
      [nome, telefone, endereco],
    );
    const clienteId = (resultadoCliente as ResultSetHeader).insertId;

    const [resultadoAgendamento] = await connection.query(
      "INSERT INTO agendamentos (cliente_id, servico_id, data, hora, status, valor_na_epoca, token_cancelamento) VALUES (?, ?, ?, ?, ?, ?)",
      [clienteId, Number(servico_id), data, hora, "aguardando", valor_na_epoca],
    );

    await connection.commit();
    return Response.json(
      {
        clienteId,
        agendamentoId: (resultadoAgendamento as ResultSetHeader).insertId,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    await connection.rollback();

    if (isDuplicateEntryError(error)) {
      return Response.json(
        {
          erro: "Esse horário acabou de ser reservado por outra pessoa. Por favor, escolha outro horário.",
        },
        { status: 409 },
      );
    }

    console.error("Erro ao criar agendamento:", error);
    return Response.json(
      { erro: "Erro ao criar agendamento. Tente novamente." },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
}

function isDuplicateEntryError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ER_DUP_ENTRY"
  );
}

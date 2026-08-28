import type { ResultSetHeader } from "mysql2/promise";
import pool from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const { token_cancelamento } = await request.json();

    if (
      typeof token_cancelamento !== "string" ||
      token_cancelamento.trim() === ""
    ) {
      return Response.json(
        { erro: "Token de cancelamento não informado" },
        { status: 400 },
      );
    }

    const [resultado] = await pool.query(
      `UPDATE agendamentos
       SET status = 'Cancelado'
       WHERE token_cancelamento = ?
         AND status = 'aguardando'`,
      [token_cancelamento],
    );

    const linhasAlteradas = (resultado as ResultSetHeader).affectedRows;

    if (linhasAlteradas === 0) {
      return Response.json(
        { erro: "Agendamento não encontrado ou não pode mais ser cancelado" },
        { status: 404 },
      );
    }

    return Response.json({ mensagem: "Agendamento cancelado com sucesso" });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return Response.json(
      { erro: "Erro ao cancelar agendamento" },
      { status: 500 },
    );
  }
}

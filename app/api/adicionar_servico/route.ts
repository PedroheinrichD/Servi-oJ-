import type { ResultSetHeader } from "mysql2/promise";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { nome, descricao, valor, url } = await request.json();

  try {
    const [result] = await pool.query(
      "INSERT INTO servicos (nome, descricao, valor, ativo) VALUES (?, ?, ?, ?)",
      [nome, descricao, valor, 1],
    );
    const servicoId = (result as ResultSetHeader).insertId;
    const urlImages = Array.isArray(url) ? url : url ? [url] : [];

    if (urlImages.length > 0) {
      await pool.query(
        "INSERT INTO servicos_images (servicos_id, url) VALUES ?",
        [urlImages.map((urlImage: string) => [servicoId, urlImage])],
      );
    }

    return Response.json(
      { message: "Serviço adicionado com sucesso", id: servicoId },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Erro ao adicionar serviço ao banco de dados" },
      { status: 500 },
    );
  }
}

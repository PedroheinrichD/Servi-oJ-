import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT servicos.id, servicos.nome, servicos.descricao, servicos.valor, COUNT(servicos_images.id) AS quantidade_imagens, GROUP_CONCAT(servicos_images.url) AS lista_url FROM servicos LEFT JOIN servicos_images ON servicos.id = servicos_images.servicos_id WHERE servicos.ativo = 1 GROUP BY servicos.id, servicos.nome, servicos.descricao, servicos.valor",
    );
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ erro: "Erro ao buscar serviços" }, { status: 500 });
  }
}

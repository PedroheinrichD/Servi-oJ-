import pool from "@/lib/db";

export async function PUT(request: Request) {
  const { nome, descricao, valor, id, url } = await request.json();
  const urlImages = Array.isArray(url) ? url : url ? [url] : [];

  try {
    await pool.query(
      "UPDATE servicos SET nome = ?, descricao = ?, valor = ? WHERE id = ?",
      [nome, descricao, valor, id],
    );
    await pool.query("DELETE FROM servicos_images WHERE servicos_id = ?", [id]);

    if (urlImages.length > 0) {
      await pool.query(
        "INSERT INTO servicos_images (servicos_id, url) VALUES ?",
        [urlImages.map((urlImage: string) => [id, urlImage])],
      );
    }

    return Response.json({ message: "servico atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "erro na requisição" }, { status: 500 });
  }
}

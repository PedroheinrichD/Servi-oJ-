import pool from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await pool.query("UPDATE servicos SET ativo = 0 WHERE id = ?", [id]);
    return Response.json({ message: "serviço desativado com sucesso" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "erro interno método: DELETE" },
      { status: 500 },
    );
  }
}

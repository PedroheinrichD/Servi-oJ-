import pool from "@/lib/db";

export async function GET(request: Request) {
  const data = new URL(request.url).searchParams.get("data");

  if (!data) {
    return Response.json({ erro: "Data não informada" }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      "SELECT hora FROM agendamentos WHERE data = ? AND status <> 'Cancelado'",
      [data],
    );
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ erro: "Erro ao buscar horários" }, { status: 500 });
  }
}

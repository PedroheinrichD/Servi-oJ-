import pool from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get("data");
    
    try {
        const [rows] = await pool.query(
            `
       SELECT
        a.id AS agendamento_id,
        a.cliente_id,
        a.servico_id,
        c.nome AS cliente_nome,
        c.telefone,
        s.nome AS servico_nome,
        a.status,
        a.valor_na_epoca,
        a.data,
        a.hora,
        c.endereco
      FROM agendamentos AS a
      INNER JOIN clientes AS c
        ON a.cliente_id = c.id
      INNER JOIN servicos AS s
        ON a.servico_id = s.id
        ${data ? "WHERE a.data = ? AND a.status = 'aguardando' " : ""} 
        ORDER BY a.hora ASC
        `,
        data ? [data] : []
        );
        return Response.json(rows);
    } catch (error) {
        console.error(error);
        return Response.json({ erro: "Erro ao buscar serviços" }, { status: 500 });
    }
}

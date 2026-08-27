import pool from "@/lib/db";

export async function PUT(request: Request) {
    const { agendamento_id } = await request.json()

    try {
        await pool.query(`
        UPDATE agendamentos
        SET status = 'atendido'
        WHERE id = ? AND status = 'aguardando';    
    `,
            [agendamento_id]
        );

        return Response.json({ message: "status atualizado com sucesso" })
    } catch (error) {
        console.log(error);
        return Response.json({ message: "erro ao realizar a atualização" }, {status: 500})
    }
}
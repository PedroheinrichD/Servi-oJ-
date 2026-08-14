import pool from "../../lib/db";

export default async function handler(req,res){
    const dataSelecionada = req.query.data // Obtém a data selecionada da query string, da requisição GET
    try {
        const [rows] = await pool.query('SELECT hora FROM agendamentos WHERE data = ?', [dataSelecionada]) // Consulta ao banco de dados para obter os horários já agendados para a data selecionada
        res.status(200).json(rows)
    } catch (error) {
        console.log(error);
    }
}


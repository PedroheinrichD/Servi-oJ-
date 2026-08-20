import pool from '../../lib/db';

export default async function handle(req, res) {
    if (req.method !== 'DELETE') {
        res.status(405).json({ message: 'método não permitido' });
        return
    }

    try {
    
        const { id } = req.body;
        const [result] = await pool.query('DELETE FROM servicos WHERE id = ?', [id])
        res.status(200).json({ message: 'delete feito com sucesso' })
    
    } catch (error) {
        res.status(500).json({message: 'erro interno método: DELETE' })
    }
}
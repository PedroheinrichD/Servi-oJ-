import pool from '../../lib/db';

export default async function handle(req, res) {
    if (req.method !== 'DELETE') {
        res.status(405).json({ message: 'método não permitido' });
        return
    }

    try {
        const { id } = req.body;
        const [deleteImage] = await pool.query('DELETE FROM servicos_images WHERE servicos_images.servicos_id = ?',[id])
        const [result] = await pool.query('DELETE FROM servicos WHERE id = ?', [id])
        res.status(200).json({ message: 'delete feito com sucesso' })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'erro interno método: DELETE' })
    }
}
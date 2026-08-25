import pool from "../../lib/db";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        res.status(405).json({ message: 'método não permitido, apenas PUT' })
        return
    }

    const { nome, descricao, valor, id, url } = req.body
    const urlImages = Array.isArray(url) ? url : url ? [url] : []

    try {
        await pool.query('UPDATE servicos SET nome = ?, descricao = ? ,valor = ? WHERE id = ?',
            [nome, descricao, valor, id]
        )

        await pool.query('DELETE FROM servicos_images WHERE servicos_id = ?', [id])

        if (urlImages.length > 0) {
            await pool.query(
                'INSERT INTO servicos_images (servicos_id, url) VALUES ?',
                [urlImages.map((urlImage) => [id, urlImage])]
            )
        }

        res.status(200).json({message: 'servico atualizado com sucesso'})
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'erro na requisição'
        })
    }
}
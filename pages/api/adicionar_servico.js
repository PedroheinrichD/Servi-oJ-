import pool from "../../lib/db";

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.status(405).json({message: 'Método não permitido'});
        return;
    }

    const { nome, descricao, valor} = req.body;
    try {
       const result = await pool.query(
        "INSERT INTO servicos (nome, descricao, valor) VALUES(?, ?, ?)",
        [nome, descricao, valor]
       )
       res.status(201).json({message:' Serviço adicionado com sucesso', id: result.insertId});
       
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Erro ao adicionar serviço ao banco de dados'});
    }
}
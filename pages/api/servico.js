import pool from "../../lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query('SELECT servicos.id, servicos.nome, servicos.descricao, servicos.valor, COUNT(servicos_images.id) AS quantidade_imagens FROM servicos LEFT JOIN servicos_images ON servicos.id = servicos_images.servicos_id GROUP BY servicos.id, servicos.nome, servicos.valor');
    res.status(200).json(rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({erro: 'Erro ao buscar serviços'})
  }
}


/* 
    const [rows] = é uma desustruturação do JS, ele
    basicamente pega o primeiro item da lista retornada
    da consulta query do banco de dados

    pool é a conexão ao banco de dados
    query(SELECT * FROM servicos WHERE ativo = 1) é a consulta do banco de dados, 
    na tabela servicos todos os ativos que tenham o numero 1,
    significa inativo

    Você nunca escreve handler(req, res) no seu código. 
    O Next.js faz isso por você, automaticamente. 
    É o framework trabalhando...

*/
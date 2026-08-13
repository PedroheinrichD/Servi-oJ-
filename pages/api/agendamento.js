import pool from '../../lib/db';

export default async function handler(req, res) {
  const { nome, telefone, endereco, servico_id, data, hora, valor_na_epoca } = req.body;

  try {
        // insert de cliente
    const [resultadoCliente] = await pool.query(
      'INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)',
      [nome, telefone, endereco]
    );
    const clienteId = resultadoCliente.insertId;


    // insert de agendamento
    const [resultadoAgendamento] = await pool.query(
      'INSERT INTO agendamentos (cliente_id, servico_id, data, hora, status, valor_na_epoca) VALUES (?, ?, ?, ?, ?, ?)',
      [clienteId, servico_id, data, hora, 'aguardando', valor_na_epoca]
    );

    res.status(201).json({
      mensagem: 'Agendamento criado com sucesso!', // depois remover isto 
      clienteId: clienteId,
      agendamentoId: resultadoAgendamento.insertId
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error); // depois remover isto 
    res.status(500).json({ erro: 'Erro ao criar agendamento. Tente novamente.' });
  }
}
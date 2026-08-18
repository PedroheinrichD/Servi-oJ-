import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const { nome, telefone, endereco, servico_id, data, hora, valor_na_epoca } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // insert de cliente
    const [resultadoCliente] = await connection.query(
      'INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)',
      [nome, telefone, endereco]
    );
    const clienteId = resultadoCliente.insertId;

    // insert de agendamento
    // se já existir um agendamento com a mesma (data, hora), o banco
    // rejeita com ER_DUP_ENTRY por causa da constraint UNIQUE (data, hora)
    const [resultadoAgendamento] = await connection.query(
      'INSERT INTO agendamentos (cliente_id, servico_id, data, hora, status, valor_na_epoca) VALUES (?, ?, ?, ?, ?, ?)',
      [clienteId, servico_id, data, hora, 'aguardando', valor_na_epoca]
    );

    await connection.commit();

    res.status(201).json({
      clienteId: clienteId,
      agendamentoId: resultadoAgendamento.insertId
    });

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        erro: 'Esse horário acabou de ser reservado por outra pessoa. Por favor, escolha outro horário.'
      });
    }

    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ erro: 'Erro ao criar agendamento. Tente novamente.' });

  } finally {
    connection.release();
  }
}
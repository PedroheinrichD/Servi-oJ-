// lib/queries.ts
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "./db";

// ─── SERVIÇOS ─────────────────────────────────────────────

export async function getServicos() {
  const [rows] = await pool.query(`
    SELECT 
      servicos.id, 
      servicos.nome, 
      servicos.descricao, 
      servicos.valor, 
      COUNT(servicos_images.id) AS quantidade_imagens, 
      GROUP_CONCAT(servicos_images.url) AS lista_url 
    FROM servicos 
    LEFT JOIN servicos_images ON servicos.id = servicos_images.servicos_id 
    WHERE servicos.ativo = 1 
    GROUP BY servicos.id, servicos.nome, servicos.descricao, servicos.valor
  `);
  return rows as RowDataPacket[];
}

export async function getServicoPorId(id: number) {
  const [rows] = await pool.query(
    "SELECT * FROM servicos WHERE id = ? AND ativo = 1",
    [id],
  );
  return (rows as RowDataPacket[])[0] || null;
}

export async function criarServico(data: {
  nome: string;
  descricao: string;
  valor: number;
  url?: string[];
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO servicos (nome, descricao, valor, ativo) VALUES (?, ?, ?, ?)",
      [data.nome, data.descricao, data.valor, 1],
    );
    const servicoId = (result as ResultSetHeader).insertId;

    const urlImages = Array.isArray(data.url)
      ? data.url
      : data.url
        ? [data.url]
        : [];
    if (urlImages.length > 0) {
      await connection.query(
        "INSERT INTO servicos_images (servicos_id, url) VALUES ?",
        [urlImages.map((urlImage) => [servicoId, urlImage])],
      );
    }

    await connection.commit();
    return { id: servicoId, ...data };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function atualizarServico(data: {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  url?: string[];
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE servicos SET nome = ?, descricao = ?, valor = ? WHERE id = ?",
      [data.nome, data.descricao, data.valor, data.id],
    );

    await connection.query(
      "DELETE FROM servicos_images WHERE servicos_id = ?",
      [data.id],
    );

    const urlImages = Array.isArray(data.url)
      ? data.url
      : data.url
        ? [data.url]
        : [];
    if (urlImages.length > 0) {
      await connection.query(
        "INSERT INTO servicos_images (servicos_id, url) VALUES ?",
        [urlImages.map((urlImage) => [data.id, urlImage])],
      );
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function desativarServico(id: number) {
  await pool.query("UPDATE servicos SET ativo = 0 WHERE id = ?", [id]);
  return { success: true };
}

// ─── AGENDAMENTOS ─────────────────────────────────────────

type HorarioAgendado = {
  hora: string;
};

export async function getHorariosAgendados(data: string) {
  const [rows] = await pool.query(
    "SELECT hora FROM agendamentos WHERE data = ?",
    [data],
  );
  return rows as HorarioAgendado[];
}

export async function criarAgendamento(data: {
  nome: string;
  telefone: string;
  endereco: string;
  servico_id: number;
  data: string;
  hora: string;
  valor_na_epoca: number;
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [resultadoCliente] = await connection.query(
      "INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)",
      [data.nome, data.telefone, data.endereco],
    );
    const clienteId = (resultadoCliente as ResultSetHeader).insertId;

    const [resultadoAgendamento] = await connection.query(
      "INSERT INTO agendamentos (cliente_id, servico_id, data, hora, status, valor_na_epoca) VALUES (?, ?, ?, ?, ?, ?)",
      [
        clienteId,
        data.servico_id,
        data.data,
        data.hora,
        "aguardando",
        data.valor_na_epoca,
      ],
    );

    await connection.commit();
    return {
      clienteId,
      agendamentoId: (resultadoAgendamento as ResultSetHeader).insertId,
    };
  } catch (error: unknown) {
    await connection.rollback();
    if (isDuplicateEntryError(error)) {
      throw new Error("Esse horário acabou de ser reservado. Escolha outro.");
    }
    throw error;
  } finally {
    connection.release();
  }
}

function isDuplicateEntryError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ER_DUP_ENTRY"
  );
}
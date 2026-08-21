import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Método não permitido" });
    return;
  }

  const { nome, descricao, valor, url } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO servicos (nome, descricao, valor, ativo) VALUES(?, ?, ?, ?)",
      [nome, descricao, valor, 1],
    );

    //url for um array, a constate recebe este array inteiro, caso contrario se não um array ele basicamente tem um valor só, por isso do [url], aí caso contrario nenhuma dessas condições sejam verdadeiras a constante fica vazia
    const urlImages = Array.isArray(url) ? url : url ? [url] : [];

    // verifica o tamanho do array mandado, adicionando para cada item do array
    if (urlImages.length > 0) {
      await pool.query(
        "INSERT INTO servicos_images (servicos_id, url) VALUES ?",
        [urlImages.map((urlImage) => [result.insertId, urlImage])], 
      );
    }

    res
      .status(201)
      .json({
        message: " Serviço adicionado com sucesso",
        id: result.insertId,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar serviço ao banco de dados" });
  }
}


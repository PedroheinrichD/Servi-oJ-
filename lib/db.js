import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(
      path.join(process.cwd(), "certs", "ca.pem"),
    ),
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

/*
    Esse arquivo é como um cartão de visitas com os dados de acesso ao banco.
    Toda vez que alguma parte do seu projeto precisar falar com o MySQL, 
    ela vai usar esse cartão. Centralizar em um único arquivo evita que
    você fique repetindo a senha e o endereço do banco em 50 lugares diferentes.
*/
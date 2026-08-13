import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',      // XAMPP roda no seu PC
  user: 'root',           // usuário padrão do XAMPP
  password: '',           // senha padrão do XAMPP é vazia
  database: 'servi-oj-',  // nome do banco que vamos criar
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

/*
    Esse arquivo é como um cartão de visitas com os dados de acesso ao banco.
    Toda vez que alguma parte do seu projeto precisar falar com o MySQL, 
    ela vai usar esse cartão. Centralizar em um único arquivo evita que
    você fique repetindo a senha e o endereço do banco em 50 lugares diferentes.
*/
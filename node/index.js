const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
const PORT = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: '123456',
    database: 'nodewk',
};

const connection = mysql.createConnection(config);
const sql = `CREATE TABLE IF NOT EXISTS people (id int not null auto_increment, name varchar(255), primary key(id))`;
connection.query(sql);


app.get('/', async (_req, res) => {
  const retorno = await getNome();
  const sql = `INSERT INTO people(name) values('${retorno}')`;
  connection.query(sql);
  fetchAll(res, connection);
});

async function getNome() {
  const gerador = await axios.get('https://randomuser.me/api/?results=1');
  const nome = gerador.data.results[0].name;
  const nomeCompleto = nome.first + ' ' + nome.last;
  console.log(nome);
  console.log(nomeCompleto);
  return nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '');
}

function fetchAll(res, connection,first,last) {
  const SELECT_QUERY = `SELECT id, name FROM people order by name`;

  connection.query(SELECT_QUERY, (error, results) => {
    if (error) {
      console.log(`Carregando a lista de pessoas houve o seguinte erro: ${error}`);
      res.status(500).send('Erro listando pessoas');
      return;
    }

    const tableRows = results
      .map(
        (pessoa) => `
        <tr>
          <td style="text-align:center" width="20%">${pessoa.id}</td>
          <td style="text-align:left" width="80%">${pessoa.name}</td>
        </tr>
      `
      )
      .join('');

    const table = `
      <table width="80%" border="1px grey solid">
        <tr>
          <th width="20%">Identificador</th>
          <th width="80%">Nome</th>
        </tr>
        ${tableRows}
      </table>`;

    res.send(`
      <div style="text-align:center">
      <h1>Full Cycle Rocks!</h1>
      <h2><strong>Lista de nomes cadastrada no banco de dados</Strong></h2>
      ${table}
      </div>
    `);

    //connection.end();
  });
}

app.listen(PORT, () => {
  console.log(`Application running on Port...: ${PORT} 🚀`);
});
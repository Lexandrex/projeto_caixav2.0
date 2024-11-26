/*import express from "express"
import cors from "cors"
import db from "./config/database.js"

import vendasRota from "./routes/vendas_routes.js"

const server = express()
server.use(express.json())
server.use(cors())
try {
    await db.authenticate()
    console.log("Conexão com o Mysql estabelecida")
    server.listen(3001, () => console.log("servidor executando em http://localhost:3001"))
} catch (e) {
    console.log("Conexão com o Mysql Não estabelecida", e)
}

server.use(vendasRota);*/
/*
import express from "express";
import cors from "cors";
import db from "./config/database.js";

import vendasRota from "./routes/vendas_routes.js";

const server = express();
server.use(express.json());
server.use(cors());

export const startServer = async () => {
  try {
    // Tentar autenticar com o banco de dados
    await db.authenticate();
    console.log("Conexão com o MySQL estabelecida");

    // Inicializar o servidor
    server.listen(3001, () =>
      console.log("Servidor executando em http://localhost:3001")
    );
  } catch (e) {
    console.error("Conexão com o MySQL não estabelecida", e);
    process.exit(1); // Encerrar o programa em caso de falha
  }
};

// Adicionar as rotas após autenticar
server.use(vendasRota);

// Chamar a função para iniciar o servidor e a conexão

startServer()
*/



import express from "express";
import cors from "cors";
import db from "./config/database.js"; // Assumindo que a configuração do Sequelize está aqui

import vendasRota from "./routes/vendas_routes.js"; // Rota para as vendas

const server = express();
server.use(express.json());
server.use(cors());


const startServer = async () => {
  try {
    // Tentar autenticar com o banco de dados
    await db.authenticate();
    console.log("Conexão com o MySQL estabelecida");

    // Inicializar o servidor na porta 3001
    server.listen(3001, () =>
      console.log("Servidor executando em http://localhost:3001")
    );
  } catch (e) {
    console.error("Erro ao conectar ao MySQL:", e);
    process.exit(1); // Caso a conexão falhe, o servidor não será iniciado
  }
};

// Adicionar as rotas após a autenticação do banco de dados
server.use(vendasRota);

// Iniciar o servidor e a conexão com o banco
startServer();

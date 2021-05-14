const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const configCors = {
  origin: "*",
  optionsStatusSuccess: "200",
};
// Configurar a conexao com o banco de dados
const cx = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comercialdb",
  port: "3306",
});

cx.connect((error, dados) => {
  if (error) {
    console.error(`Erro ao tentar executar o servidor -> ${error.stack}`);
    return;
  }
  console.log(`Dados do servidor -> ${cx.threadId}`);
});

// Rotas para o usuário
app.post("/usuario/cadastro", cors(configCors), (req, res) => {
  cx.query("insert into tbusuario set ?", [req.body], (error, result) => {
    if (error) {
      res.status(400).send({ output: `Não cadastrou -> ${error}` });
      return;
    }
    res.status(201).send({ output: result });
  });
});

app.get("/usuario/listar",cors(configCors),(req,res)=>{
  cx.query("select * from tbusuario",(error,result)=>{
    if(error){
      res.status(400).send({output:`Não foi possivel listar os usuários -> ${error}`});
      return;
    }
    res.status(200).send({output:result});
  });
});
app.put("/usuario/alterarsenha/:id",cors(configCors),(req,res)=>{
  cx.query("update tbusuario set ? where idusuario=?",[req.body,req.params.id],(error,result)=>{
    if(error){
      res.status(400).send({output:`Não foi possível alterar a senha -> ${error}`});
      return;
    }
  })
})
app.post("/usuario/login",cors(configCors),(req,res)=>{
  const us = req.body.nomeusuario;
  const sh = req.body.senha;
  cx.query("select * from tbusuario where nomeusuario=? and senha=?",[us,sh],(error,result)=>{
    if(error){
      res.status(400).send({output:`Erro ao tentar efetuar login -> ${error}`});
      return;
    }
    res.status(200).send({output:result})
    });
  });


app.listen(5532,()=>console.log("Servidor online na pr=orta 5532"));

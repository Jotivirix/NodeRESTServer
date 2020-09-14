const express = require("express");
const app = express();
const bcrypt = require('bcrypt');

const Usuario = require("../models/usuarioModel");

app.get("/usuario", function (req, res) {
  res.json("Usuarios");
});

app.post("/usuario", function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password,10),
    role: body.role,
  });

  usuario.save((error,usuarioDB) => {
    if(error){
      return res.status(400).json({
        ok:false,
        error:error
      })
    }
    else{
      //Hemos llegado bien, guardamos el usuario 
      res.json({
        ok:true,
        usuario: usuarioDB
      })
    }
  })
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  res.json({
    message: "User to be updated",
    id: id,
  });
});

app.delete("/usuario", function (req, res) {
  res.json("Borrar usuario");
});

module.exports = app;

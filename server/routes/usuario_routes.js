const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../models/usuarioModel");

app.get("/usuarios", function (req, res) {
  let desde = Number(req.query.desde || 0);
  let limite = Number(req.query.limite || 5);

  Usuario.find({estado:true}, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error: error,
        });
      }
      //Total de usuarios
      Usuario.count({estado:true}, (error, total) => {
        res.json({
          ok: "true",
          totalRegistros: total,
          usuarios,
        });
      });
    });
});

app.get("/usuariosDeBaja", function (req, res) {
  let desde = Number(req.query.desde || 0);
  let limite = Number(req.query.limite || 5);

  Usuario.find({estado:false}, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error: error,
        });
      }
      //Total de usuarios
      Usuario.count({estado:false}, (error, total) => {
        res.json({
          ok: "true",
          totalRegistros: total,
          usuarios,
        });
      });
    });
});

app.post("/usuario", function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((error, usuarioDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error: error,
      });
    } else {
      //Hemos llegado bien, guardamos el usuario
      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  });
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;

  //Tenemos que evitar actualizar ciertos campos que no queremos que se actualicen
  //Utilizamos el metodo pick de la libreria underscore
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  //Cogemos el modelo de mongoose
  Usuario.findOneAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (error, usuarioDB) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      //El usuario se ha actualizado correctamente
      return res.status(200).json({
        ok: true,
        mensaje: "Usuario Actualizado Correctamente",
        usuario: usuarioDB,
      });
    }
  );
});

//Borrado Fisico
app.delete("/usuario/:id", function (req, res) {
  let id = req.params.id;

  //Podemos eliminar el usuario de BBDD o cambiar el flag de estado a false
  //Borrando el usuario de BBDD
  Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error,
      });
    }

    if (usuarioBorrado == null) {
      return res.status(400).json({
        ok: false,
        mensaje: "Usuario No Encontrado",
      });
    }

    res.json({
      ok: "Usuario Borrado",
      usuarioBorrado,
    });
  });
});

//Borrado Logico
app.delete("/usuarioBL/:id", function (req, res) {
  let id = req.params.id;

  //Borrado Logico
  //Tenemos que buscar al usuario por ID y cambiarle el flag de estado a false
  Usuario.findByIdAndUpdate(id, {estado: false}, { new: true }, (error, usuarioDesact) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      if (usuarioDesact == null) {
        return res.status(400).json({
          ok: false,
          mensaje: "Usuario No Encontrado",
        });
      }
  
      res.json({
        ok: "Usuario Desactivado",
        usuarioDesact,
      });
    }
  );

});

module.exports = app;

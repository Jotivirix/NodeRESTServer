require('../config/config');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/",(req,res) => {
  res.json({
    mensaje: "Bienvenido a la HOME"
  })
})

app.get("/usuario", function (req, res) {
  res.json("Usuarios");
});

app.post("/usuario", function (req, res) {
  let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            message: 'The name is needed'
        });
    }
    else{
        res.json({
            persona: body
        });
    }

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

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto", process.env.PORT);
});

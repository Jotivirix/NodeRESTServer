require('./config/config');

const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const rutasUsuario = require('./routes/usuario_routes');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(rutasUsuario);

/*LOCALHOST*/
mongoose.connect('mongodb+srv://Jotivirix:Jota_121194@cluster0.b3djl.mongodb.net/cafe?retryWrites=true&w=majority',{useNewUrlParser:true, useCreateIndex: true},(err, res) => {
  if(err){
    throw err;
  }
  else{
    console.log('Base de datos ONLINE');
    console.log(process.env.URLDB);
  }
});


app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto", process.env.PORT);
});

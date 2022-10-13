// Dependencias
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// Iniciamos express
const app = express();
const port = 3000;

// Traducir json
app.use(bodyParser.json());

// Database URl
const uri = `mongodb+srv://anuar:${process.env.MONGO_PASSWORD}@codecluster.pc6xcdb.mongodb.net/?retryWrites=true&w=majority`;

const client = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, client, (err) => {
  console.log("conecting...");
  if (err) {
    console.log("error in connection", err);
  } else {
    console.log("mongodb is connected");
  }
});

// Data Models
const studentSchema = new mongoose.Schema({
  name: String,
  lastName: String,
});

const Student = mongoose.model("Student", studentSchema);

// routes
// Traer todos los estudiantes
app.get("/", async (request, response) => {
  const students = await Student.find({});
  console.log(students);
  response.json(students);
});

// Crear nuevo estudiante
app.post("/", async (request, response) => {
  let student = new Student(request.body);
  const newStudent = await student.save();
  response.send(newStudent);
});

app.put("/:id", (request, response) => {
  const id = request.params.id;
  const newValues = request.body;
  const selected = dataBase.estudiantes.findIndex(
    (estudiante) => estudiante.id == id
  );

  // Actualizar valores
  dataBase.estudiantes[selected] = newValues;

  // Escribir en el archivo
  const json = JSON.stringify(dataBase);
  fs.writeFile("estudiantes.json", json, "utf8", () => {
    response.send("Estudiante editado exitosamente");
  });
});

app.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const deleted = await Student.findOneAndDelete({
    _id: id,
  });

  if (deleted === null) {
    response.send("Estudiante no existe");
  }

  response.send("Estudiante eliminado");
});

// servidor
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

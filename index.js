// Dependencias
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
// Iniciamos express
const app = express();
const port = 3000;

// Traducir json
app.use(bodyParser.json());

// read JSON
const archivoJSON = fs.readFileSync("estudiantes.json");
const dataBase = JSON.parse(archivoJSON);

// routes
app.get("/", (request, response) => {
  response.send(dataBase.estudiantes);
});

app.post("/", (request, response) => {
  const newStudent = request.body;
  // Crear nuevo estudiante
  dataBase.estudiantes.push(newStudent);
  // Escribir en el archivo
  const json = JSON.stringify(dataBase);
  fs.writeFile("estudiantes.json", json, "utf8", () => {
    response.send("Estudiante agregado exitosamente");
  });
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

app.delete("/:id", (request, response) => {
  const id = request.params.id;
  const selected = dataBase.estudiantes.findIndex(
    (estudiante) => estudiante.id == id
  );

  if (selected < 0) {
    response.status(404).send("Estudiante no encontrado");
    return;
  }

  // Remover elemento del array
  dataBase.estudiantes.splice(selected, 1);

  // Escribir en el archivo
  const json = JSON.stringify(dataBase);
  fs.writeFile("estudiantes.json", json, "utf8", () => {
    response.send("Estudiante borrado exitosamente");
  });
});

// servidor
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

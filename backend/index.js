const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: '🚗 AutoBox API funcionando correctamente' });
});

app.listen(PORT, () => {
  console.clear(); // Limpia la consola
  console.log('✨ Backend iniciado exitosamente');
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
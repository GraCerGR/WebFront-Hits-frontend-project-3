const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Разрешаем использование статических файлов
app.use(express.static(path.join(__dirname), { 
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Определяем маршрут для страницы login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

app.get('/patients', (req, res) => {
  res.sendFile(path.join(__dirname, 'patients', 'patients.html'));
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
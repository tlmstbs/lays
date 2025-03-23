// index.js
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mysql = require('mysql2/promise'); // подключаем mysql2/promise
const todoRoutes = require('./routes/todos');


const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Создадим переменную db в глобальной области
let db;

// Добавим middleware, чтобы передавать db в роуты через req
app.use((req, res, next) => {
  req.db = db; // доступно во всех роутерах через req.db
  next();
});

app.use(todoRoutes);

app.use(express.static(path.join(__dirname, 'public')))

// Подключаемся к БД и стартуем сервер
async function start() {
  try {
    db = await mysql.createConnection({
      host: "platon.teyhd.ru",
      port: 3407,
      user: "student",
      password: "studpass",
      database: "vika_todo",
    });

    console.log('Connected to MySQL');

    app.listen(PORT, () => {
      console.log('Server has been started on port', PORT);
    });
  } catch (e) {
    console.error('DB connection failed:', e);
  }
}

start();

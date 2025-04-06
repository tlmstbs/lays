import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";
import mysql from "mysql2/promise";
import { mlog } from "./vendor/logs.js";
import session from "express-session";

import {
  findAll,
  create,
  findById,
  updateStatus,
  get_username,
  insert_user,
  get_all_dbstat
} from "./vendor/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  resave: false,
  saveUnitialized: false,
  secret: "keyboard cat",
  cookie: {}
}));

let db;

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.name;
  res.locals.username = req.session.name;
  next();
});

app.use(async function (req, res, next) {
  const page = req._parsedOriginalUrl.pathname;
  const openPages = ["/auth", "/register", "/data"];

  if (!req.session.name && !openPages.includes(page)) {
    res.redirect("/auth");
  } else if (req.session.name && (page === "/auth" || page === "/register")) {
    res.redirect("/");
  } else {
    next();
  }
});

app.get("/", async (req, res) => {
  try {
    const todos = await findAll(req.db, req.session.user_id);
    const mappedTodos = todos.map((item) => ({
      _id: item.id,
      title: item.content,
      completed: !!item.status,
    }));

    res.render("index", {
      title: "Todos list",
      isIndex: true,
      todos: mappedTodos
    });
  } catch (err) {
    mlog(err);
    res.status(500).send("Server error");
  }
});

app.get("/create", (req, res) => {
  res.render("create", {
    title: "Create todo",
    isCreate: true,
  });
});

app.get("/allstat", async (req, res) => {
  const result = await get_all_dbstat();
  res.render("allstat", {
    len: result.length,
    users: result,
    title: "Статистика"
  });
});

app.get("/auth", (req, res) => {
  res.render("auth", {
    title: "Авторизация"
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    title: "Регистрация"
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Ошибка при выходе");
    }
    res.redirect("/auth");
  });
});

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await get_username(username);
    const user = users.find(u => u.password === password);

    if (user) {
      req.session.name = user.username;
      req.session.role = user.role;
      req.session.user_id = user.id;
      res.json({ status: "ok" });
    } else {
      res.json({ status: "error", message: "Неверный логин или пароль" });
    }
  } catch (err) {
    mlog(err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await get_username(username);
    if (result.length > 0) {
      return res.json({ status: "error", message: "Пользователь уже существует" });
    }

    const user_id = await insert_user(username, password, 0);
    req.session.name = username;
    req.session.role = 0;
    req.session.user_id = user_id;

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

app.post("/create", async (req, res) => {
  try {
    await create(req.db, req.body.title, req.session.user_id);
    res.redirect("/");
  } catch (err) {
    mlog(err);
    res.status(500).send("Server error");
  }
});

app.post("/toggle-status", async (req, res) => {
  try {
    const { id, completed } = req.body;
    await updateStatus(req.db, id, parseInt(completed, 10));
    res.status(200).json({ success: true });
  } catch (err) {
    mlog(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

async function start() {
  try {
    db = await mysql.createConnection({
      host: "platon.teyhd.ru",
      port: 3407,
      user: "student",
      password: "studpass",
      database: "vika_todo",
    });

    mlog("Успешное подключение к MySQL");

    app.listen(PORT, () => {
      mlog("Сервер запущен на порту", PORT);
    });
  } catch (e) {
    mlog("Не удалось установить соединение с БД", e);
  }
}

start();

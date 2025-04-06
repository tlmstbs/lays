import unixTime from "unix-time";
import { mlog } from "./logs.js";
import urlencode from "urlencode";
import path from "path";
import mysql from "mysql2";

export async function get_username(username) {
  const qer = 'SELECT * FROM users WHERE username = ?';
  const [rows, fields] = await pool.query(qer, [username]);
  return rows;
}

export async function insert_user(username, password, role) {
  const qer = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  const [result, fields] = await pool.query(qer, [username, password, role]);
  return result.insertId;
}

let sets = {
  host: "platon.teyhd.ru",
  port: 3407,
  user: "student",
  password: "studpass",
  database: "vika_todo",
  waitForConnections: true,
  connectionLimit: 50,
  maxIdle: 50,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(sets).promise();

export async function findAll(db, user_id) {
  const qer = 'SELECT * FROM todos WHERE user_id = ?';
  const [rows, fields] = await db.query(qer, [user_id]);
  return rows;
}

export async function create(db, content, user_id) {
  const qer = 'INSERT INTO todos (content, status, user_id) VALUES (?, 0, ?)';
  const [result, fields] = await db.query(qer, [content, user_id]);
  return result.insertId;
}

export async function findById(db, id) {
  const qer = 'SELECT * FROM todos WHERE id = ?';
  const [rows, fields] = await db.query(qer, [id]);
  return rows[0];
}

export async function updateStatus(db, id, newStatus) {
  const numId = parseInt(id, 10);
  const numStatus = parseInt(newStatus, 10);

  if (isNaN(numId) || (numStatus !== 0 && numStatus !== 1)) {
    throw new Error(`Некорректные данные: id=${numId}, status=${numStatus}`);
  }

  const qer = 'UPDATE todos SET status = ? WHERE id = ?';
  const [result, fields] = await db.query(qer, [numStatus, numId]);

  if (result.affectedRows === 0) {
    throw new Error(`Задача с id=${numId} не найдена`);
  }
}

export async function get_all_dbstat() {
  const qer = `SELECT * FROM resview ORDER BY sum DESC;`;
  const [rows, fields] = await pool.query(qer);
  return rows;
}

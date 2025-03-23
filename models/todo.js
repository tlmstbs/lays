// models/Todo.js

// Здесь просто экспортируем функции, и будем передавать `db` в каждом вызове
module.exports = {
  async findAll(db) {
    const [rows] = await db.query('SELECT * FROM todos');
    return rows;
  },

  async create(db, content) {
    const [result] = await db.query(
      'INSERT INTO todos (content, status) VALUES (?, 0)',
      [content]
    );
    return result.insertId;
  },

  async findById(db, id) {
    const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    return rows[0];
  },

  async updateStatus(db, id, newStatus) {
    await db.query('UPDATE todos SET status = ? WHERE id = ?', [newStatus, id]);
  }
};

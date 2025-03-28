module.exports = {
  async findAll(db) {
    const [rows] = await db.query("SELECT * FROM todos");
    return rows;
  },

  async create(db, content) {
    const [result] = await db.query(
      "INSERT INTO todos (content, status) VALUES (?, 0)",
      [content]
    );
    return result.insertId;
  },

  async findById(db, id) {
    const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
    return rows[0];
  },

  async updateStatus(db, id, newStatus) {
    if (isNaN(id) || (newStatus !== 0 && newStatus !== 1)) {
      throw new Error(`Некорректные данные: id=${id}, status=${newStatus}`);
    }
  
    const [result] = await db.query(
      'UPDATE todos SET status = ? WHERE id = ?',
      [newStatus, id]
    );
  
    if (result.affectedRows === 0) {
      throw new Error(`Задача с id=${id} не найдена`);
    }
  }
};

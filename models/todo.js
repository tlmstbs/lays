export async function findAll(db) {
  const [rows] = await db.query("SELECT * FROM todos");
  return rows;
}

export async function create(db, content) {
  const [result] = await db.query(
    "INSERT INTO todos (content, status) VALUES (?, 0)",
    [content]
  );
  return result.insertId;
}

export async function findById(db, id) {
  const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
  return rows[0];
}

export async function updateStatus(db, id, newStatus) {
  const numId = parseInt(id, 10);
  const numStatus = parseInt(newStatus, 10);

  if (isNaN(numId) || (numStatus !== 0 && numStatus !== 1)) {
    throw new Error(`Некорректные данные: id=${numId}, status=${numStatus}`);
  }

  const [result] = await db.query(
    "UPDATE todos SET status = ? WHERE id = ?",
    [numStatus, numId]
  );

  if (result.affectedRows === 0) {
    throw new Error(`Задача с id=${numId} не найдена`);
  }
}

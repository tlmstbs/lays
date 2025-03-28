const { Router } = require('express');
const Todo = require('../models/todo');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll(req.db);

    const mappedTodos = todos.map(item => ({
      _id: item.id,
      title: item.content,
      completed: !!item.status
    }));

    res.render('index', {
      title: 'Todos list',
      isIndex: true,
      todos: mappedTodos
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create todo',
    isCreate: true
  });
});

router.post('/create', async (req, res) => {
  try {
    await Todo.create(req.db, req.body.title);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.post('/toggle-status', async (req, res) => {
  try {
    const { id, completed } = req.body;
    await Todo.updateStatus(req.db, id, completed);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;

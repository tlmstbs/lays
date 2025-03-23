// routes/todos.js
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

router.post('/complete', async (req, res) => {
  try {
    const completed = !!req.body.completed;
    await Todo.updateStatus(req.db, req.body.id, completed ? 1 : 0);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/complete', async (req, res) =>{
  const todo= await Todo.findById(req.body.id)

  todo.completed=!!req.body.completed
  await todo.save()

  res.redirect('/')
})

module.exports = router;

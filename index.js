import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import exphbs from 'express-handlebars';
import mysql from 'mysql2/promise';
import todoRoutes from '../routes/todos.js'; 

import {mlog} from './vendor/logs.js'
import { count } from 'console';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
//   helpers: {
//     OK: function(){
//       i_count=1
//     },
//     I_C: function (opts){
//       let anso = ' '
//       for (let i = 0; i< i_count; i++){
//         anso = anso + "I"
//       }
//       i_count++
//       return anso
//     },
//     PLS: function (a,opts){
// return a+10
//     }  
//   }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

let db;

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(todoRoutes);

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
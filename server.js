const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'carsonhaskell',
    password: '',
    database: 'smart-brain',
  },
});

const app = express();
app.use(cors());

app.use(express.json());

const extractUser = (req, res, next) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        req.user = user[0];
        next();
      } else {
        res.status(400).json('No user found!');
      }
    })
    .catch((err) => res.status(400).json('Error getting user'));
};

app.get('/', (req, res) => {
  res.json('App is working.');
});

app.get('/users', (req, res) => {
  db.select('*')
    .from('users')
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error getting users'));
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((loginInfo) => {
      const isValid = bcrypt.compareSync(password, loginInfo[0].hash);

      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('Wrong credentials'));
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) res.json('Error: missing fields.');

  const hashedPassword = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hashedPassword,
        email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('Unable to register'));
});

app.get('/profile/:id', extractUser, (req, res) => {
  const { user } = req;

  res.json(user);
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json('Unable to get entries'));
});

app.listen(3000, () => console.log('✅ --> server running on port 3000 🚀'));

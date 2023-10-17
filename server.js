const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const { registerRoute } = require('./controllers/register');
const { signinRoute } = require('./controllers/signin');
const { profileRoute } = require('./controllers/profile');
const { imageRoute } = require('./controllers/image');
const { usersRoute } = require('./controllers/users');
const { extractUser } = require('./middleware/userExtractor');

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

app.get('/', (req, res) => {
  res.json('App is working.');
});

app.get('/users', usersRoute(db));

app.post('/signin', signinRoute(db, bcrypt));

app.post('/register', registerRoute(db, bcrypt));

app.get('/profile/:id', extractUser, profileRoute);

app.put('/image', imageRoute(db));

app.listen(3000, () => console.log('✅ --> server running on port 3000 🚀'));

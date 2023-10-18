const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const { registerRoute } = require('./controllers/register');
const { signinRoute } = require('./controllers/signin');
const { profileRoute } = require('./controllers/profile');
const { imageRoute, imageApiRoute } = require('./controllers/image');
const { usersRoute } = require('./controllers/users');
const { extractUser } = require('./middleware/userExtractor');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PS,
    database: process.env.DB_DB,
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

app.post('/imageurl', imageApiRoute);

app.listen(3000, () => console.log('✅ --> server running on port 3000 🚀'));

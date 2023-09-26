const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'Sally@gmail.com',
      password: 'apples',
      entries: 0,
      joined: new Date(),
    },
  ],
};

const extractUser = (req, res, next) => {
  const { id } = req.params;

  const user = database.users.find((user) => user.id === id);

  if (!user) return res.status(404).json('No user found!');

  req.user = user;
  next();
};

app.get('/', (req, res) => {
  res.json('App is working.');
});

app.get('/users', (req, res) => {
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const user = database.users.find((user) => user.email === email);

  if (email === user.email && password === user.password) {
    res.json(user);
  } else {
    res.status(400).json('Invalid email or password');
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) res.json('Error: missing fields.');

  const newUser = {
    id: '125',
    name,
    email,
    entries: 0,
    joined: new Date(),
  };

  database.users = [...database.users, newUser];

  res.json(newUser);
});

app.get('/profile/:id', extractUser, (req, res) => {
  const { user } = req;

  res.json(user);
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  const user = database.users.find((user) => user.id === id);

  if (!user) return res.status(404).send('No user found!');

  user.entries++;
  res.json(user.entries);
});

app.listen(3000, () => console.log('✅ --> server running on port 3000 🚀'));

/*
  ✅ /                 -->     res   =    this is working
  ✅ /signin           -->     POST  =    success/fail
  ✅ /register         -->     POST  =    user
  ✅ /profile/:userId  -->     GET   =    user
  ✅ /image            -->     PUT   =    user 
*/

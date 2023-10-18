import express, { json } from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

import { registerRoute } from './controllers/register';
import { signinRoute } from './controllers/signin';
import { profileRoute } from './controllers/profile';
import { imageRoute, imageApiRoute } from './controllers/image';
import { usersRoute } from './controllers/users';
import { extractUser } from './middleware/userExtractor';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB,
  },
});

const app = express();
app.use(cors());

app.use(json());

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

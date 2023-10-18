const registerRoute = (db, bcrypt) => (req, res) => {
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
};

export default {
  registerRoute,
};

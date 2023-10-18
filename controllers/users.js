const usersRoute = (db) => (req, res) => {
  db.select('*')
    .from('users')
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error getting users'));
};

export default {
  usersRoute,
};

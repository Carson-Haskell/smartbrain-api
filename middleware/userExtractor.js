const extractUser = (req, res, db, next) => {
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

export default {
  extractUser,
};

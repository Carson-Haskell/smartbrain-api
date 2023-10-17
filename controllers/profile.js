const profileRoute = (req, res) => {
  const { user } = req;

  res.json(user);
};

module.exports = {
  profileRoute,
};

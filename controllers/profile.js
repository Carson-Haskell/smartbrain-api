const profileRoute = (req, res) => {
  const { user } = req;

  res.json(user);
};

export { profileRoute };

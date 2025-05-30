module.exports = function permit(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(403).send({ error: "Acceso denegado" });
    }

    if (user.role === "superadmin") {
      return next();
    }

    if (allowedRoles.includes(user.role)) {
      return next();
    }

    return res.status(403).send({ error: "Acceso denegado" });
  };
};

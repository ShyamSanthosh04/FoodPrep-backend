function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = authorizeRoles;

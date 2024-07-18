const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    if (req.session.user.role === 'admin') {
      return res.redirect('/realtimeproductsAdmin');
    } else {
      return res.redirect('/realtimeproductsUser');
    }
  }
};

const ensureAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.redirect("/realtimeproductsUser");
  }
};
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

const ensureUser = (req, res, next) => {
  if (req.session.user && req.session.user.role !== "admin") {
    return next();
  } else {
    return res.redirect("/realtimeproductsAdmin");
  }
};

module.exports = {
  ensureAdmin,
  ensureUser,
  isAuthenticated,
  isNotAuthenticated,
  isAdmin
};

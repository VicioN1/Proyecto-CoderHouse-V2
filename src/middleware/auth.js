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
    res.redirect("/realtimeproducts");
  }
};

const ensureAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.redirect("/realtimeproductsUser");
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
};

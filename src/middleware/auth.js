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
    switch (req.session.user.role) {
      case "user":
        return res.redirect('/realtimeproductsUser')
      case "admin":
        return res.redirect('/realtimeproductsAdmin')
      case "premium":
        return res.redirect('/realtimeproductsPremium')
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
    return res.redirect("/realtimeproductsUser");
  }
};

const ensurePremium = (req, res, next) => {
  if (req.session.user && req.session.user.role !== "admin") {
    return next();
  } else {
    return res.redirect("/realtimeproductsPremium");
  }
};

module.exports = {
  ensureAdmin,
  ensureUser,
  ensurePremium,
  isAuthenticated,
  isNotAuthenticated,
  isAdmin
};

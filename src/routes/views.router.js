const express = require("express");
const router = express.Router();
const ProductService = require("../services/ProductService.js");
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

const service_Product = new ProductService();

router.get("/", (req, res) => {
  service_Product
    .getProducts()
    .then((productos) => {
      res.render("index", { productos });
    })
    .catch((error) => ({ message: error }));
});

router.get("/realtimeproducts", isAuthenticated, (req, res) => {
  res.render("realTimeProducts", { user: req.session.user});
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get('/carts/:userId', (req, res) => {
  const userId = req.params.userId;

  console.log(userId)
  res.render('carts', { userId });
});

router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.session.user });
});

module.exports = router;

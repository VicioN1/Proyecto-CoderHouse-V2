const express = require("express");
const router = express.Router();
const { productService } = require('../services/repository.js');
const { cartService } = require('../services/repository.js');
const { isAuthenticated, isNotAuthenticated, ensureAdmin, ensureUser} = require('../middleware/auth');


router.get("/", (req, res) => {
  productService
    .getProducts()
    .then((productos) => {
      res.render("index", { productos });
    })
    .catch((error) => ({ message: error }));
});

router.get('/realtimeproductsUser',isAuthenticated, ensureUser, (req, res) => {
  res.render('realtimeproductsUser', { user: req.session.user});
});

router.get('/realtimeproductsAdmin', isAuthenticated, ensureAdmin, (req, res) => {
  res.render('realtimeproductsAdmin', { user: req.session.user});
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get('/carts/:userId', (req, res) => {
  const cartId = req.query.email;
  const emailId = cartId.replace(/^\$/, '');
  const userId = req.params.userId;
  
  res.render('carts', { userId, emailId});
});

router.get('/purchase/:userId', (req, res) => {
  const cartId = req.query.email;
  const emailId = cartId.replace(/^\$/, '');
  const userId = req.params.userId;
  console.log(emailId,userId)
  const datapurchase = cartService.purchase(emailId)
  console.log("---------------datapurchase viewrouter-----------------------")
  console.log(datapurchase)

  res.render('purchase', { userId });
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

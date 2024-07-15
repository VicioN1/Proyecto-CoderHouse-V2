const express = require("express");
const router = express.Router();
const { productService } = require('../services/repository.js');
const { cartService } = require('../services/repository.js');
const { isAuthenticated, isNotAuthenticated, ensureAdmin, ensureUser} = require('../middleware/auth');
const { mailingController } = require('../utils/nodemailer.js');


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

router.get('/purchase/:userId', async (req, res) => {
  try {
    const cartId = req.query.email;
    const emailId = cartId.replace(/^\$/, '');
    const userId = req.params.userId;
    const datapurchase = await cartService.purchase(emailId);

    
    await mailingController( emailId,datapurchase);
    // Convertir los datos en un objeto JSON puro
    const datapurchasePure = JSON.parse(JSON.stringify(datapurchase));
    console.log("---------------datapurchase---------------");
    console.log(datapurchasePure);
    console.log(datapurchasePure.code);

    res.render('purchase', { datapurchase: datapurchasePure });
  } catch (error) {
    console.error("Error al procesar la compra", error);
    res.status(500).send("Error al procesar la compra");
  }
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

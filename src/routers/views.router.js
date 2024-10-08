const express = require("express");
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');
const viewController = require('../controllers/viewController.js');
const { productService } = require('../services/repository.js');
const { isAuthenticated, isNotAuthenticated, ensureAdmin, ensureUser, ensurePremium} = require('../middleware/auth');



router.get("/", (req, res) => {
  res.render("login")
});

router.get('/realtimeproductsUser',isAuthenticated, ensureUser, (req, res) => {
  res.render('realtimeproductsUser', { user: req.session.user});
});

router.get('/realtimeproductsAdmin', isAuthenticated, ensureAdmin, (req, res) => {
  res.render('realtimeproductsAdmin', { user: req.session.user, title: 'Dashboard'});
});

router.get('/Premiumstore', isAuthenticated, ensurePremium, (req, res) => {
  res.render('Premiumstore', { user: req.session.user, title: 'Mis Productos'});
});

router.get('/adminstore', isAuthenticated, ensureAdmin, (req, res) => {
  res.render('adminstore', { user: req.session.user, title: 'Productos'});
});

router.get('/realtimeproductsPremium', isAuthenticated, ensurePremium, (req, res) => {
  res.render('Premiumstore', { user: req.session.user});
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
    const datapurchase = req.query.datapurchase ? JSON.parse(decodeURIComponent(req.query.datapurchase)) : null;
    res.render('purchase', { datapurchase });
  } catch (error) {
    res.status(400).send({ error: 'Error al procesar los datos de la compra' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/profile', isAuthenticated, viewController.getCurrentUser, (req, res) => {
  res.render('profile', { user: req.userDTO });
});

router.get('/resetpassword', (req, res) => {
  res.render('resetPassword');
});

router.get('/documentacion/:userId', (req, res) => {
  const userId = req.params.userId;
  res.render('documents',  { userId });
});

router.get('/newpassword/:code', (req, res) => {
  const { code } = req.params;
  res.render('newpassword', { code });
});
module.exports = router;

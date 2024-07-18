const bcrypt = require('bcrypt');
const passport = require('passport');
const { userService } = require('../services/repository.js');
const { cartService }= require('../services/repository.js');
const UserDTO = require('../dao/DTOs/userDTO.js');

exports.register = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const carrito = await cartService.addCarts();
    const idcarrito = await cartService.getCartId(carrito);
    console.log(carrito)
    console.log("---------------register idcarrito---------------")
    console.log(idcarrito)
    await userService.addUser(first_name, last_name, email, age, password, idcarrito);
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error al registrar usuario');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserById(email);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Contraseña incorrecta');

    const carts = await userService.getCartsById(user._id || user.id);
    console.log(carts);

    req.session.user = {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: carts.cart_id,
      role: user.role,
    };

    if (user.role === 'admin') {
      res.redirect('/realtimeproductsAdmin');
    } else {
      res.redirect('/realtimeproductsUser');
    }
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect('/login');
  });
};

exports.github = passport.authenticate('github', { scope: ['user:email'] }),
async (req, res) => {};

exports.githubCallback = (req, res, next) => {
  passport.authenticate('github', { failureRedirect: '/login' }, async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      const carts = await userService.getCartsById(user._id);

      req.session.user = {
        id:  user._id || user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        cart: carts.cart_id,
        role: user.role,
      };

      if (user.role === 'admin') {
        res.redirect('/realtimeproductsAdmin');
      } else {
        res.redirect('/realtimeproductsUser');
      }
    });
  })(req, res, next);
};

exports.getCurrentUser = (req, res) => {
  const userDTO = new UserDTO(req.session.user);
  console.log(userDTO)
  res.json(userDTO);
};

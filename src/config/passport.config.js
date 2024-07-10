const passport = require("passport");
const GitHubStrategy = require("passport-github2");
const User = require("../models/user.model");
const dotenv = require("dotenv");
const { cartService }= require('../services/repository.js');
dotenv.config();

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          
          console.log(profile);
          let user = await User.findOne({ email: profile._json.email });
          if (!user) {
            console.log("entre 1 -------------------------------------")
            const carrito = await cartService.addCarts();
            const idcarrito = await cartService.getCartsById(carrito); 
            const newUser = {
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 20,
              password: " ",
              carts: [{
                cart_id: idcarrito.id,
                cart: idcarrito._id
              }],
              role: "user",
            };
            const result = await User.create(newUser);
            done(null, result);
          } else {
            console.log("entre 2 --------------------------------------")
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {

    let user = await User.findById(id);
    done(null, user);
  });
};
module.exports = initializePassport;

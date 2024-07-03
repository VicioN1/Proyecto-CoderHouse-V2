const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const { Server } = require("socket.io");

const viewsRouter = require("./routes/views.router.js");
const productsRoutes = require("./routes/productRoutes");
const cartsRoutes = require("./routes/cartRoutes.js");
const sessionsRoutes = require("./routes/sessionsRoutes");

const { handleSocketConnection } = require("./services/SocketService.js");
const connectDB = require('./config/dbConfig.js');
const initializePassport = require('./config/passport.config.js');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    }),
    // cookie: { maxAge: 180 * 60 * 1000 },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const httpServer = app.listen(
  process.env.PORT || 8080,
  () => console.log(`Server running on port ${process.env.PORT || 8080}`)
);
const socketServer = new Server(httpServer);
handleSocketConnection(socketServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/products/", productsRoutes);
app.use("/api/carts/", cartsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/", viewsRouter);

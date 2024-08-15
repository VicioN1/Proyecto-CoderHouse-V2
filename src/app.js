const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const mockingRouter = require("./routers/mockingRouter");
const viewsRouter = require("./routers/views.router.js");
const productsRoutes = require("./routers/productRouter.js");
const cartsRoutes = require("./routers/cartRouter.js");
const sessionsRoutes = require("./routers/sessionsRoutes");
const userRoutes = require("./routers/usersRouter.js");
const loggerRouter = require("./routers/loggerRouter.js");
const config = require("./config/config.js");
const { handleSocketConnection } = require("./SocketService.js");
const connectDB = require('./config/dbConfig.js');
const initializePassport = require('./config/passport.config.js');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL
    }),
    // cookie: { maxAge: 180 * 60 * 1000 },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());

const httpServer = app.listen(
  config.PORT || 8080,
  () => console.log(`Server running on port ${config.PORT || 8080}`)
);

const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentacion',
          description: 'API pensada para Ecommers'
      }
  },
  apis: [path.join(__dirname, 'docs/**/*.yaml')],
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


const socketServer = new Server(httpServer);
handleSocketConnection(socketServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/public")));

app.use("/mocking" , mockingRouter);
app.use('/Testlogger', loggerRouter );
app.use("/api/products/", productsRoutes);
app.use("/api/carts/", cartsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/user", userRoutes);
app.use("/", viewsRouter);

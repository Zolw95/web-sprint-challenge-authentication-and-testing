const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");

const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
  session({
    resave: false, // avoid recreating sessions that have not changed
    saveUninitialized: false, // compy with GDPR laws for setting cookies
    secret: `${process.env.JWT_SECRET}`, // cryptographically save the
  })
);

server.use("/api/auth", authRouter);
server.use("/api/jokes", jokesRouter);

module.exports = server;

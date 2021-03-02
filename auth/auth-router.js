const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("./authModel");
router.post("/register", async (req, res, next) => {
  try {
    // implement registration
    const { username, password } = req.body;

    if (username.length < 3) {
      return res
        .status(409)
        .json({ msg: "Username must be at least 3 characters long" });
    }

    if (password.length < 6) {
      return res
        .status(409)
        .json({ msg: "Password must be at least 6 characters long" });
    }

    const user = await Auth.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        msg:
          "This username is already taken, please choose a different username",
      });
    }

    const newUser = await Auth.add({
      username,
      password: await bcrypt.hash(password, 14),
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  // implement login

  let token;

  try {
    const { username, password } = req.body;
    const user = await Auth.findBy({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // hash the password AGAIN and see if it matches what we have in db
    const validate = await bcrypt.compare(password, user.password);

    if (!validate) {
      return res.status(401).json({
        msg: "Invalid Credentials",
      });
    }

    // If password valid - generate new session for user
    // and send back session ID
    // req.session.user = user;

    const token = jwt.sign(
      {
        userID: user.id,
      },
      `${process.env.JWT_SECRET}`
    );

    // send the token back as a cookie
    res.cookie("token", token);

    res.json({
      message: `Welcome ${user.username}`,
      token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

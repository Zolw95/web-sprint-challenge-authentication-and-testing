/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authError = {
    msg: "Please log in",
  };
  try {
    const token = req.headers.authorization;
    console.log("TOKEN", token);

    if (!token) {
      return res.status(405).json(authError);
    }

    // decode the token, re-sign the payload and check if the signature is valid
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
      if (err) {
        return res.status(401).json(authError);
      }
      req.token = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};

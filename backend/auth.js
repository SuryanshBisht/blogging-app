const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

module.exports = {
    auth: (req, res, next) => { 
      const authHeader = req.headers["authorization"];
      console.log(req.cookies);
      console.log(JSON.parse(JSON.stringify(req.cookies)));

      const cookieToken=req.cookies.token;
      console.log('cookie token', cookieToken);
      if (!authHeader) {
        return res.status(403).json({msg: "Missing auth header"});
      }
      if(!cookieToken) {
        return res.status(403).json({msg: "Missing token in cookie"})
      }
      const decoded = verifyToken(cookieToken);
      if (decoded && decoded.userid) {
          req.userId = decoded.userid;
          next();
      } else {
          return res.status(403).json({msg: "Incorrect token"});
      }
    }
}
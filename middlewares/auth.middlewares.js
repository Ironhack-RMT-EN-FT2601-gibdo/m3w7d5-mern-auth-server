const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {

  try {
    
    const token = req.headers.authorization.split(" ")[1]

    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    // console.log(payload)
    // we extract the payload from the token and pass it to the route inside the request.
    req.payload = payload

    next() // continue with the route
  } catch (error) {
    // console.log(error)
    //1. there is no token
    //2. the token was invalid (it was tampered with)
    //3. the token has expired
    res.status(401).json({errorMessage: "There is no token. Or token is invalid or expired."})
  }

}

function verifyAdmin(req, res, next) {
  // this is a protection middleware that checks if the user is of type admin
  // IT WILL ALWAYS BE USED AFTER verifyToken

  if (req.payload.role === "admin") {
    next() // you are an admin, continue with the route.
  } else {
    res.status(401).json({errorMessage: "Route only for admins, you are not an admin, get out"})
  }
}

module.exports = {
  verifyToken,
  verifyAdmin
}
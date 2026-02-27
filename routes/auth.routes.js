const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs")

// POST "/api/auth/signup" => Creating a user document
router.post("/signup", async (req, res, next) => {
  console.log(req.body)

  const {email, password, username} = req.body

  // Validators?

  // - are the 3 fields received?
  if (!email || !password || !username) {
    res.status(400).json({ errorMessage: "All fields are required (email, password, username)" })
    return // now stop the route from continuing.
  }

  // - is the password strong enough? (length, characters)
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/gm
  if ( passwordRegex.test(password) === false ) {
    res.status(400).json({ errorMessage: "Password must follow this pattern (min 8 characters, max 20 characters, include lowercase, include uppercase, include number)" })
    return // now stop the route from continuing.
  }
  
  // EXTRA - is the email format correct?
  
  
  
  // - passwords should not be stored without hashing.
  
  try {
    
    // - does the email already exist?
    const foundUser = await User.findOne( { email: email } )
    if (foundUser) {
      res.status(400).json({ errorMessage: "User already registered with that email" })
      return // now stop the route from continuing.
    }

    const hashPassword = await bcrypt.hash(password, 12)

    
    const response = await User.create({
      email: email,
      password: hashPassword,
      username: username
    })

    res.status(201).json(response)

  } catch (error) {
    next(error)
  }

})

// POST "/api/auth/login" => Validating user credentials and sending the Token
router.post("/login", async(req, res, next) => {

  // creating and sending the token
  
  const {email, password} = req.body
  
  // validate fields
  if (!email || !password) {
    res.status(400).json({ errorMessage: "All fields are required (email, password)" })
    return // now stop the route from continuing.
  }
  
  try {
    // validate if user exists
    const foundUser = await User.findOne( { email: email } )
    console.log(foundUser)
    if (!foundUser) {
      res.status(400).json({ errorMessage: "User not registered with that email! Please sign up first." })
      return // now stop the route from continuing.
    }

    // validate password
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if (isPasswordCorrect === false) {
      res.status(400).json({ errorMessage: "Password not correct!" })
      return // now stop the route from continuing.
    }
    
    res.send("all good from login")
  } catch (error) {
    next(error)
  }
    
})

// GET "/api/auth/verify" => Validates the token on new users accesing the client


module.exports = router
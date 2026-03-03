const router = require("express").Router();

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")

// ℹ️ Organize and connect all your route files here.
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)


//! THIS IS JUST AN EXAMPLE OF A ROUTE YOU WISH TO KEEP PRIVATE
router.get("/example-private-route", verifyToken, (req, res) => {
  // console.log(req.headers)

  //! IN THE ROUTE you might need info about the user
  console.log(req.payload)


  res.send("Here is your user specific private information")
})

router.get("/example-admin-route", verifyToken, verifyAdmin, (req, res) => {
  res.send("here is your SUPER SECRET admin only information")
})

module.exports = router;

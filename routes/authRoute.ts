import express from "express";
import passport, { use } from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import { userModel, database } from "../models/userModel";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  //read and kill the messages??? 
  const messages = req.session.messages || [];
  res.render("login", {messages: req.session.messages});
  req.session.messages = [];
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register.ejs")
})

router.post("/register", (req, res) => {
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password
  let dbname = database.find((dbname) => dbname.name === name);
  let dbEmail = database.find((dbEmail) => dbEmail.email === email);

  if(dbname || dbEmail) {
    throw new Error('user already exists, please login')
    return
  }
  database.push({
    id:Date.now(),
    name: name,
    email: email,
    password: password
  })
  res.redirect("/auth/login")
})


router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;

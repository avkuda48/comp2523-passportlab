import express from "express";
import passport, { use } from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import { userModel, database } from "../models/userModel";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {

  let messages = (req.session as any).messages || [] //how to kill the session???
  res.render("login", { messages });
  (req.session as any) = []
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
    password: password,
    role: "user"
  })
  res.redirect("/auth/login")
})


router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

export default router;

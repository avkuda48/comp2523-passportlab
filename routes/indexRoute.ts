import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get('/admin/dashboard', (req, res) => {
  const user = req.user
  const session = (req.session as any).passport
  const isAdmin = user?.role === "admin"
  if(!isAdmin) {
    throw new Error('You are not an admin.')
  }
  res.render('adminDash.ejs', { session, user: req.user })
})

export default router;



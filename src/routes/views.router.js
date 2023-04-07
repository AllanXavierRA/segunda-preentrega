import express from "express";
import ProductManager from '../controller/productManager.js'
import { User } from "../dao/model/users.js";
import passport from "passport";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {})
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
  });
  
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async(req, res) => {
  const {name, email, password} = req.body;

  const emailUser = await User.findOne({email: email})

  if(emailUser){
    res.send('El usuario ya ha sido registrado')
  }
  const newUser = new User({name, email, password});
  newUser.password = await newUser.encryptPassword(password)
  await newUser.save();

  res.redirect('/register')
})


router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/error', (req, res) => {
  res.render('errorUser')
})

router.get('/successUser', (req, res) => {
  res.render('successUser')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/error',
  successRedirect: '/successUser'
}), (req, res) => {
  
  req.login(req.user, err => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    } else {
      res.redirect('/successUser');
    }
  });
});


export default router




const express = require('express');
const { register, login,googleLogin,googleSignup } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/googlelogin', googleLogin);
router.post('/googlesignup', googleSignup);

module.exports = router;

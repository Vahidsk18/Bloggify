const express = require('express');
const { userSignin, userSignup, userCreation, userLogin, userLogout } = require('../controllers/user')
const router = express.Router();


router.get('/signin', userSignin);
router.get('/signup', userSignup);


router.post('/signin', userLogin)
router.post('/signup', userCreation)

router.get('/logout', userLogout)




module.exports = router;
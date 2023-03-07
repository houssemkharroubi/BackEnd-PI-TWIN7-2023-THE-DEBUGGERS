var express = require('express');
var router = express.Router();
const {login_get}=require('../controllers/authController');
const {login_post}=require('../controllers/authController');
const {logout_get}=require('../controllers/authController');
const {forget_password}=require('../controllers/authController');
const {reset_password}=require('../controllers/authController');



router.get('/login',login_get);
router.post('/login',login_post);
router.get('/logout',logout_get);
router.post('/forget-password',forget_password);
router.get('/reset-password',reset_password);

module.exports = router;
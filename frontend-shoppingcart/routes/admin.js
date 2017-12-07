var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../models/admin');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/adminPage', isLoggedIn,function (req, res, next) {
        res.render('admin/adminPage');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});


router.get('/adminSignin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('admin/adminSignin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/adminSignin', passport.authenticate('local.adminSignin',{
    failureRedirect: '/admin/adminSignin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
        res.redirect('/admin/adminPage');
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
   //
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
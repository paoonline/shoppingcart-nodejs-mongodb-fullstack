var passport = require('passport');
var passport1 = require('passport');
var Admin = require('../models/admin');
var LocalStrategy1 = require('passport-local').Strategy;

passport1.serializeUser(function (user, done) {
    done(null, user.id);
});

passport1.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, user) {
        done(err, user);
    });
});

passport1.use('local.adminSignup', new LocalStrategy1({
    usernameField: 'email',
    password: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Admin.findOne({'email': email}, function (err, user) {
        if(err){
            return done(err);
        }
        if (user){
            return done(null, false, {message: 'Email is already in use.'});
        }
        var newUser = new Admin();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));


passport1.use('local.adminSignin', new LocalStrategy1({
    usernameField: 'email',
    password: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Admin.findOne({'email': email}, function (err, user) {
        if(err){
            return done(err);
        }
        if (!user){
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });

}));




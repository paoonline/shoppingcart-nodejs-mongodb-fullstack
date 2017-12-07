var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var Payment = require('../models/payment');

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks});
    });

});


router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn,function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
        var saveDeliveryPrice = req.body.delivery;
        var deliveryPrice = 0;

        if(saveDeliveryPrice == 50){
            deliveryPrice = 50;
        }else{
            deliveryPrice = 20;
        }

        var saveTotalPrice = cart.totalPrice;
        var total = saveTotalPrice +deliveryPrice;
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            totalPrices: total,
            delivery: req.body.delivery
        });
        order.save(function (err, result) {
            if(err){
                req.flash('error', err.message);
                return res.redirect('/checkout');
            }else{
                req.flash('success', 'สั่งซื้อสินค้าสำเร็จ!');
                req.session.cart = null;
                res.redirect('/user/profile');
            }
        });
});

router.get('/payment', isLoggedIn,function (req, res, next) {
    var successMsg = req.flash('success')[0];
    res.render('shop/payment',{successMsg: successMsg, noMessages: !successMsg});
});

router.post('/payment', isLoggedIn,function (req, res, next) {

    var payment = new Payment({
        orderids: req.body.orderids,
        pricepayment: req.body.pricepayment,
        timepayment: req.body.timepayment,
        bank: req.body.bank
        // address: req.body.address,
        // name: req.body.name,
        // delivery: req.body.delivery
    });
    payment.save(function (err, result) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/payment');
        }else{
            req.flash('success', 'แจ้งยืนยันการโอนแล้ว!');
            req.session.cart = null;
            res.redirect('/payment');
        }
    });
});

router.get('/productDetail/:id', function (req, res, next) {
    Product.findById(req.params.id, function (err, docs) {
        if(err){
            res.render('/');
        }
        else{
            var productId = req.params.id;
            Product.findById(productId, function (err, product) {
                console.log(req.session.cart);
                res.render('shop/productDetail', {items: docs});
            });
        }
    });
});

router.get('/productDetail/:id/:title', function (req, res, next) {
    Product.findById(req.params.id, function (err, docs) {
        if(err){
            res.render('/');
        }
        else{
            var productId = req.params.id;
            var cart = new Cart(req.session.cart ? req.session.cart : {});

            Product.findById(productId, function (err, product) {
                cart.add(product, product.id);
                req.session.cart = cart;
                console.log(req.session.cart);
                res.render('shop/productDetail', {items: docs});
            });
        }
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

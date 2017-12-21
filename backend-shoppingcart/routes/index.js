var Bbs = require('../persister/bbs');
var express = require('express');
var Payment = require('../persister/payment');
var Orders = require('../persister/order');
var users = require('../persister/user');
var Products = require('../persister/product');
var validUrl = require('valid-url');
var multer = require('multer');
var fs = require('fs');
var upload = multer({
	dest: '../public/images/',

});
var type = upload.single('imagePath1');



module.exports = function (app, passport) {

	// app.use(multer({dest:'./images/'}).single('imagePath'));
	/* GET home page. */
	app.get('/', isAuthenticated, function (req, res) {
		res.redirect('/readme');
	});

	app.post('/login', passport.authenticate('login', {
		successRedirect: '/readme',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/login', function (req, res) {
		res.render('template/login', { message: req.flash('message') });
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});


	app.get('/signup', function (req, res) {
		res.render('template/signup', { message: req.flash('message') });
	});

	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	app.get('/readme', isAuthenticated, function (req, res) {
		res.render('template/readme', {});
	});

	app.get('/order', isAuthenticated, function (req, res) {
		Orders.find({}, function (err, orders) {
			res.render('template/order', { orders: orders });
		});
	});

	app.get('/payment', isAuthenticated, function (req, res) {
		//res.render('', {});
		// Payment.find(function (err, docs) {
		//     var productChunks = [];
		//     var chunkSize = 3;
		//     for (var i = 0; i < docs.length; i += chunkSize){
		//         productChunks.push(docs.slice(i, i + chunkSize));
		//     }
		//     res.render('template/payment', { title: 'Shopping Cart', Payment: productChunks});
		// });
		Payment.find({}, function (err, payment) {
			payment1 = '';
			order1 = '';
			res.render('template/payment', { payment: payment, payment1: payment1, order1: order1 });
		});
	});

	app.get('/payment/:orderob/:orderids', isAuthenticated, function (req, res) {
		Payment.find({}, function (err, payment) {
			// var url = "http://localhost:3002/payment";
			// if (validUrl.isUri(url)){
			//    payment1 = 0;
			// }
			// else{
			//    payment1 = req.params.orderob
			// }
			payment1 = req.params.orderob;
			order1 = req.params.orderids;
			res.render('template/payment', { payment1: payment1, payment: payment, order1: order1 });
		});

	});

	app.post('/payment/:orderob/:orderids', isAuthenticated, function (req, res) {
		// // var Order = new Orders({
		// //
		// //     status: req.body.status
		// // });
		var orderid = req.body.payment1;

		Orders.findById(orderid, function (err, doc) {
			if (err) {
				console.error('error, no entry found');
				res.redirect('/payment');
			} else {
				doc.status = "โอนเรียบร้อยแล้ว";
				doc.save();
				res.redirect('/payment');
			}
		});
	});

	app.get('/user', isAuthenticated, function (req, res) {
		users.find({}, function (err, users1,idu) {
			idu = req.body.search1;
			res.render('template/user', { users1: users1, idu: idu });
		});
	});

	app.get('/user/idu', isAuthenticated, function (req, res) {
		
		// users.findById(idu, function (err, users1) {
		// 	res.render('template/users', { users1: users1, idu: idu });
		// });
		var idu = req.body.search1;
		users.findById(idu, function (err, docs) {
			if (err) {
				res.render('/');
			}
			else {
				
				users.findById(idu, function (err, product) {
					res.render('template/users', { items: docs });
				});
			}
		});
	});

	app.get('/product', isAuthenticated, function (req, res) {
		Products.find({}, function (err, products) {
			ids = '';
			title = '';
			res.render('template/product', { products: products, ids: ids, title: title });
		});
	});

	app.get('/product/:id/:title', isAuthenticated, function (req, res) {
		Products.find({}, function (err, products) {
			// var url = "http://localhost:3002/payment";
			// if (validUrl.isUri(url)){
			//    payment1 = 0;
			// }
			// else{
			//    payment1 = req.params.orderob
			// }
			ids = req.params.id;
			title = req.params.title;
			res.render('template/product', { products: products, ids: ids, title: title });
		});

	});

	app.post('/product/:id/:title', isAuthenticated, function (req, res) {
		// // var Order = new Orders({
		// //
		// //     status: req.body.status
		// // });
		var Product1 = req.body.product1;
		Products.findByIdAndRemove(Product1).exec();
		res.redirect('/product');
	});

	app.get('/editproduct/:id', isAuthenticated, function (req, res) {
		Products.findById(req.params.id, function (err, docs) {
			if (err) {
				res.render('/');
			}
			else {
				var productId = req.params.id;
				Products.findById(productId, function (err, product) {
					res.render('template/editproduct', { items: docs });
				});
			}
		});

	});

	app.post('/editproduct/:id', isAuthenticated, function (req, res) {
		var ids = req.params.id;
		var title = req.body.title;
		var description = req.body.description
		var price = req.body.price;
		var imagePath = req.body.imagePath1;

		Products.findById(ids, function (err, doc) {
			if (err) {
				console.error('error, no entry found');
				res.redirect('/product');
			} else {		
				doc.title = title;
				doc.description = description;
				doc.price=  price;
				doc.imagePath = imagePath;
				doc.save();
				res.redirect('/product');
			}
		});
	});

	app.get('/addproduct', isAuthenticated, function (req, res) {
		res.render('template/addproduct');
	});

	app.post('/addproduct', type, isAuthenticated, function (req, res) {
		var products = new Products({
			title: req.body.title,
			description: req.body.description,
			price: req.body.price,
			imagePath: req.body.imagePath1
		});
		// products.imagePath.data = fs.readFileSync('public/images/capture.png')
		// products.imagePath.contentType = 'image/jpg';

		products.save(function (err, result) {
			if (err) {
				return res.redirect('/addproduct');
			} else {
				res.redirect('/addproduct');

			}
		});
	});

	app.get('/dashboard', isAuthenticated, function (req, res) {
		res.render('template/index', {});
	});
	app.get('/flot', isAuthenticated, function (req, res) {
		res.render('template/flot', {});
	});
	app.get('/morris', isAuthenticated, function (req, res) {
		res.render('template/morris', {});
	});
	app.get('/tables', isAuthenticated, function (req, res) {
		res.render('template/tables', {});
	});
	app.get('/forms', isAuthenticated, function (req, res) {
		res.render('template/forms', {});
	});
	app.get('/panelswells', isAuthenticated, function (req, res) {
		res.render('template/panelswells', {});
	});
	app.get('/buttons', isAuthenticated, function (req, res) {
		res.render('template/buttons', {});
	});
	app.get('/notifications', isAuthenticated, function (req, res) {
		res.render('template/notifications', {});
	});
	app.get('/typography', isAuthenticated, function (req, res) {
		res.render('template/typography', {});
	});
	app.get('/icons', isAuthenticated, function (req, res) {
		res.render('template/icons', {});
	});
	app.get('/grid', isAuthenticated, function (req, res) {
		res.render('template/grid', {});
	});
	app.get('/blank', isAuthenticated, function (req, res) {
		res.render('template/blank', {});
	});

	app.get('/bbs', isAuthenticated, function (req, res) {
		res.render('template/bbs', {});
	});

	app.get('/bbs/list', isAuthenticated, function (req, res) {
		Bbs.find({},
			function (err, bbs) {
				// In case of any error, return using the done method
				if (err)
					return done(err);
				// Username does not exist, log error & redirect back
				res.send(bbs);
			}
		);
	});

	app.post('/bbs/create', isAuthenticated, function (req, res) {

		var newBbs = new Bbs();
		// set the user's local credentials
		newBbs.content = req.param('content');
		newBbs.vote = 0;
		newBbs.username = req.user.username;

		// save the user
		newBbs.save(function (err) {
			if (err) {
				console.log('Error in Saving bbs: ' + err);
				res.send({ "result": false });
			}
			res.send({ "result": true });
		});
	});

	app.post('/bbs/delete', isAuthenticated, function (req, res) {
		// set the user's local credentials
		var id = req.param('id');
		Bbs.findByIdAndRemove(id, function (err) {
			if (err) {
				console.log('Error in Saving bbs: ' + err);
				res.send({ "result": false });
			}


			res.send({ "result": true });
		})


	});
	app.post('/bbs/update', isAuthenticated, function (req, res) {
		// set the user's local credentials
		var id = req.param('id');

		Bbs.findById(id, function (err, bbs) {
			if (err) {
				console.log('Error in Saving bbs: ' + err);
				res.send({ "result": false });
			}
			bbs.vote += 1;
			bbs.save(function () {
				res.send({ "result": true });
			})

		})
	});
}
// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}




var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('admin:422544@ds133476.mlab.com:33476/shopping');

var products = [
    new Product({
    imagePath: 'https://n2.sdlcdn.com/imgs/c/h/e/Artek-BY-780S-IP-PTZ-SDL675581087-2-0adcf.jpg',
    title: 'IP CAMERA',
    description: 'Awesome Camera',
    price: 1500
    }),

    new Product({
        imagePath: 'https://img.banggood.com/images/oaupload/banggood/images/A3/F5/b80af935-8b33-436d-84d0-e7ee7f4b4245.jpg',
        title: 'Camera car',
        description: 'Awesome Camera car',
        price: 1200
    }),

    new Product({
        imagePath: 'https://www.creativesoch.com/wp-content/uploads/2016/08/cctv.png',
        title: 'CCTV',
        description: 'Awesome CCTV',
        price: 2200
    }),

    new Product({
        imagePath: 'https://assets.logitech.com/assets/64731/7/c922-pro-stream-webcam.png',
        title: 'WebCam',
        description: 'Awesome WebCam',
        price: 500
    }),

    new Product({
        imagePath: 'https://cdn.shopify.com/s/files/1/1654/4887/products/spy-pen-camera-9__44338_1024x1024.jpg?v=1481652448',
        title: 'Pen Camera',
        description: 'Awesome pen camera',
        price: 1200
    }),

    new Product({
        imagePath: 'https://images-na.ssl-images-amazon.com/images/I/71QrgUjU4WL._SL1500_.jpg',
        title: 'hidden camera',
        description: 'Awesome hidden camera',
        price: 2200
    }),
];


var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function (err, result) {
        done++;
        if(done == products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}


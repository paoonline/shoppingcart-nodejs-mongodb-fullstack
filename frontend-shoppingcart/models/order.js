var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateFormat = require('dateformat');
var moment = require('moment');

var autoIncrement = require('mongoose-auto-increment');


// var hourFromNow = function(){
//     return moment().add(7, 'hour');
// };

var nnn = new Date();
dateFormat(nnn, "dddd, mmmm dS, yyyy, h:MM:ss TT");



var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    orderid: {type: Number,required: true, unique: true,default: 10000},
    delivery: {type: Number,required: true},
    totalPrices: {type: Number,required: true},
    time : { type: Date, default: dateFormat},
    status : { type: String, required: true, default: 'ยังไม่ได้ชำระเงิน'}
});

autoIncrement.initialize(mongoose.connection);

schema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'orderid',
    startAt: 10000,
    incrementBy: 1
});

module.exports = mongoose.model('Order', schema);






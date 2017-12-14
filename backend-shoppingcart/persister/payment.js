var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateFormat = require('dateformat');
var nnn = new Date();
dateFormat(nnn, "dddd, mmmm dS, yyyy, h:MM:ss TT");
var schema = new Schema({
    orderids: {type: Number, required:true},
    pricepayment: {type: Number, required:true},
    timepayment: {type: String , required:true},
    bank: {type: String, required:true},
    //user: {type: Schema.Types.ObjectId, ref: 'User'},
    // orderob: {type: Schema.Types.ObjectId, ref: 'Order'},
    orderob: {type: Schema.Types.ObjectId, required:true},
    time : {type : Date, default: dateFormat}
});

module.exports = mongoose.model('Payment', schema);

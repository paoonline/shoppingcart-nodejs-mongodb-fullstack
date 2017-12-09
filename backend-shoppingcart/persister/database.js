var mongoose = require('mongoose');

// @ TODO remove for production level.
//mongoose.set('debug', true);

var db = function() {
  var initFlag = false;
  return {

    config: function(addr, dbname, opts, callback) {
      if( !initFlag ){
        // var connectUrl = 'mongodb://' + (addr ? addr : 'localhost:27017/shopping');
        // mongoose.connect(connectUrl, (opts ? opts : {}));
         // admin:422544@ds133476.mlab.com:33476/shopping
          mongoose.connect('localhost:27017/shopping');
        //mongoose.createConnection(connectUrl, (opts ? opts : {}));

        var db = mongoose.connection;

        db.on('error', function(err) {
          // Connection Error
          console.log('Mongodb error encountered [' + err + ']');

          if (callback) {
            callback('ERR-MONGODB', 'mongodb - '+err.message);
          }
        });

        db.once('open', function() {
          initFlag = true;
          if (callback) callback(null);
        });
      } else {
        if (callback) callback(null);
      }
    }
  };
};

module.exports = db();
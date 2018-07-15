const mongoose = require('mongoose');

const config = require('./config');

const db_server  = process.env.DB_ENV || 'primary';

const mongooseConnection = mongoose.connection.on("connected", function(ref) {
    console.log("Connected to " + db_server + " DB!");

    port = process.env.port || 3000;
    ip = process.env.ip;
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
    console.error('Failed to connect to DB ' + db_server + ' on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});

const gracefulExit = function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
        process.exit(0);
    });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

try {
    const options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
    console.log("Trying to connect to DB " + db_server);
} catch (err) {
    console.log("Sever initialization failed " , err.message);
}

module.exports = mongooseConnection;
request = require('request');
var config = require('../../config');


module.exports = {
    getUsers: getUsers,
    getUserByID: getUserByID
}

function getUsers(req, res) {
    switch (config.DB) {
        case "usergrid":
            request(config.UG + '/users', function(error, response, body) {
                if (error) {
                    res.send(error);
                } else {
                    res.send(body);
                }
            });
            break;
        case "mysql":
            // connection.query('SELECT * FROM users', [], function(err, rows, fields) {
            //     if (err) {
            //         res.send('error');
            //     } else {
            //         var results = {};
            //         results.entities = rows;
            //         results.count = rows.length;
            //         res.send(results);
            //     }
            // });
            break;
    }
}

function getUserByID(req, res) {
    var user = req.swagger.params.username.value;
    switch (config.DB) {
        case "usergrid":
            request(config.UG + "/users?ql=username='" + user + "'", function(error, response, body) {
                if (error) {
                    res.send(error);
                } else {
                    res.send(body);
                }
            });
            break;
        case "mysql":
            // connection.query('SELECT * FROM users WHERE username = ?', user, function(err, rows, fields) {
            //     if (err) {
            //         res.send('error');
            //     } else {
            //         var result = {};
            //         result.entities = rows;
            //         res.send(result);
            //     }
            // });
            break;
    }
}
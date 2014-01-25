
var express = require('express');
var http = require('http');


var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
        fs.readFile('./templates/index.html', function(err, data) {
                res.end(data);
        })
});



var server = http.createServer(app);

server.listen(process.env.PORT || 1997);




var express = require('express');

var http = require('http');

var app = express();

app.use(express.logger());

console.log('check 1');


app.get('/', function(req, res) {
        fs.readFile('./templates/index.html', function(err, data) {
                res.end(data);
        })
		
		
console.log('check 2');


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});



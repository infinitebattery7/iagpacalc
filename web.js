var express = require('express');
var http = require('http');
var fs = require('fs');
var Twit = require('twit');
var sentimental = require('Sentimental')

var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
        fs.readFile('./templates/index.html', function(err, data) {
                res.end(data);
        })
});

var performSentimentAnalysis = function(tweetSet) {
        var result = 0;
        for(var i = 0; i < tweetSet.length; i++) {
                tweet = tweetSet[i]['text'];
                retweets = tweetSet[i]['retweet_count'];
                faves = tweetSet[i]['favorite_count'];
                tweet = tweet.replace('#', '');
                var score = sentimental.analyze(tweet)['score'];
                result += score;
                if(score > 0){
                        if(retweets > 0) {
                                result += (Math.log(retweets)/Math.log(2));
                        }
                        if(faves > 0) {
                                result += (Math.log(faves)/Math.log(2));
                        }
                }
                else if(score < 0){
                        if(retweets > 0) {
                                result -= (Math.log(retweets)/Math.log(2));
                        }
                        if(faves > 0) {
                                result -= (Math.log(faves)/Math.log(2));
                        }
                }
                else {
                        result += 0;
                }
        }
        result = result / tweetSet.length;
        return result
}

app.post('/query', function(req, res) {
        
        global.choices = JSON.parse(req.body.choices);
        
        var today = new Date();
        
        var T = new Twit({
                consumer_key: 'get your own key',
                consumer_secret: 'get your own key',
                access_token: 'get your own key',
                access_token_secret: 'get your own key'
        });
        
        global.highestScore = -Infinity;
        global.highestChoice = null;
        
        for(var i = 0; i < choices.length; i++) {
                global.currentChoice = global.choices[i];
                T.get('search/tweets', {q: '' + currentChoice + ' since:' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(), count:20}, function(err, data) {
                        var score = performSentimentAnalysis(data['statuses']);
                        if(score > highestScore) {
                                global.highestScore = score;
                                global.highestChoice = global.currentChoice;
                        }
                });
        }
        
        setTimeout(function() { res.end(JSON.stringify({'score': highestScore, 'choice': global.highestChoice})) }, 3000);
        
});

var server = http.createServer(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});



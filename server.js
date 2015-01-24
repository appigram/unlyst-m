var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    sessions = require('./server/routes/sessions'),
    multer = require('multer'),
    aws = require("aws-sdk"),
    app = express();
    compress = require('compression');

var mailer = require('./server/email-client');
var elasticSearch = require('./server/elastic-search');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIAILDO7FWEDSP4NQEA';
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '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';
var S3_BUCKET = process.env.S3_BUCKET || 'unlyst';
var GLOBAL_CDN = "http://img.unlyst.co/";
//app.use(bodyParser());          // pull information from html in POST
app.use(compress());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());      // simulate DELETE and PUT

app.use(multer({
    inMemory: true
}));

app.use(express.static('client/www'));

// CORS (Cross-Origin Resource Shariappng) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/server/sessions', sessions.findAll);
app.get('/server/sessions/:id', sessions.findById);

app.set('port', process.env.PORT || 5000);

//app.use(function(req, res) {
//    res.sendFile(__dirname + '/client/www/view/index.html');
//});

app.get('*', function(req,res) {
    res.sendFile(__dirname + '/client/www/index.html');
});

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY ,
    secretAccessKey: AWS_SECRET_KEY
});

aws.config.region = 'us-east-1';
var s3 = new aws.S3();

app.post('/upload', function (req,res){
    console.log(req.body);
    var file_name ='image/homes/' + req.body.houseId+ '/' + req.body.imageNum + '.' +req.files.file.extension;
    console.log(req.files);
    var params = {
        Bucket: S3_BUCKET,
        Key: file_name,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
        Body:req.files.file.buffer,
        ServerSideEncryption: 'AES256'
    };
    s3.putObject(params, function(err, data) {
        if(err) {
            // There Was An Error With Your S3 Config
            res.end("Error: failed to upload pictures");
            return false;
        } else {
            // Success!
            console.log("Success");
            res.end(GLOBAL_CDN + file_name);
            }
        })
        .on('httpUploadProgress',function(progress) {
            // Log Progress Information
            console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
        });
    //res.json(req.files);
});

app.post('/sendmail', function (req,res) {
    var mail_to = req.body.email;
    if(mail_to) {
        mailer.sendMail(mail_to, function(data) {
            res.json(data);
        });
    } else {
        console.log('no email given');
    }
});
app.post('/search', function (req,res) {
  var query = req.body.query;
  res.json('test');
  console.log('search posted');
});
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



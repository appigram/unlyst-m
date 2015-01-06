var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    sessions = require('./server/routes/sessions'),
    multer = require('multer'),
    aws = require("aws-sdk"),
    app = express();

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIAILDO7FWEDSP4NQEA';
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '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';
var S3_BUCKET = process.env.S3_BUCKET || 'unlyst';

//app.use(bodyParser());          // pull information from html in POST
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
    res.sendFile(__dirname + '/client/www/view/index.html');
});

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY ,
    secretAccessKey: AWS_SECRET_KEY
});

aws.config.region = 'us-east-1';
var s3 = new aws.S3();

app.post('/upload', function (req,res){
    console.log("in post");
    var path = req.files.file.path;
    var params = {
        Bucket: S3_BUCKET,
        Key: "test/" + "testing" + ".jpg",
        ACL: 'public-read',
        ContentType: 'image/jpeg',
        Body:req.files.file.buffer,
        ServerSideEncryption: 'AES256'
    };
    s3.putObject(params, function(err, data) {
        if(err) {
            // There Was An Error With Your S3 Config
            return false;
        } else {
            // Success!
            console.log(data);
            }
        })
        .on('httpUploadProgress',function(progress) {
            // Log Progress Information
            console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
        });
    res.json(req.files);
    res.end("ok");
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
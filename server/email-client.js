var mandrill = require('mandrill-api/mandrill');

var MANDRILL_API_KEY = 'nAUfC3pptIJIHDpmtODqGw';

var email_from = 'hello@unlyst.com',
    email_subject = 'Welcome to Unlyst',
    email_content = 'Thanks for registering.';
    

var mandrill_client = new mandrill.Mandrill(MANDRILL_API_KEY);

exports.sendMail = function(to, callback) {
    var params = {
        "message": {
            "from_email":email_from,
            "to":[{"email":to}],
            "subject": email_subject,
            "text": email_content
        }
    };
    mandrill_client.messages.send(params, function(res) {
        console.log(res);
        callback(res);
    }, function(err) {
        console.log(err);
        callback(err);
    });
};
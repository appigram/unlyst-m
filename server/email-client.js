var mandrill = require('mandrill-api/mandrill');

var MANDRILL_API_KEY = 'e0cP2xC85G6IRtLg2w-chw';

var email_from = 'hello@unlyst.com',
email_subject = 'Welcome to Unlyst',
email_content = 'Thanks for registering.';
var mandrill_client = new mandrill.Mandrill(MANDRILL_API_KEY);

exports.sendMail = function (to, callback) {
  var params = {
    "message": {
      "from_email": email_from,
      "to": [{"email": to}],
      "subject": email_subject,
      "text": email_content,
      "template_name": "Testing email",
      "template_content": [
        {
          "name": "header",
          "content": "<h2>Your Order is Complete</h2>"
        },
        {
          "name": "main",
          "content": "We appreciate your business. Your order information is below."
        }
      ]
    }
  };
  mandrill_client.messages.send(params, function (res) {
    console.log(res);
    callback(res);
  }, function (err) {
    console.log(err);
    callback(err);
  });
};
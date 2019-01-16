var fromAddr="pushpa@axelta.com"
var mail_pwd="Ammananna@196";
function mailService(req, resp) {
    var email = req.params.email;
    var message = req.params.message;
    var MailText = (message.replace("\"", "")).replace("\"", "");
 // function sendMailGmail(req, resp){
    var transport = mailer().createTransport({
        host:"smtp.gmail.com",
        port:"587"
    });
    log(req);
    function sendEmail(requestObj){
        transport.sendMail({
            from: fromAddr,
            password:mail_pwd,
            to: email,
            subject: "Alert",
            text: MailText
            //html: MailText
        }, function(error, response){
            transport.close();
            if(error){
                resp.error(error);
            }else{
                resp.success("Thank you "+req.params.firstName+" "+req.params.lastName+".  Your request has been submitted");
            }
        });
    }
    
    ClearBlade.init({request:req});
    sendEmail();
    
//};	
}
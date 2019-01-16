var TWILLIOSID="AC218b72987d86853c5adb921370115a20";
var TWILLIOAUTH="4579ca6ba4fae7b232c03c64aeae40e7";
var TWILLIOPHONE="5127102383";
var _resp;
function http_sendSMSMessage(req, resp){
    ClearBlade.init({request:req});
    _resp = resp;
    log(req);
    var msg, phone;
    if ( ! req.params.phone) { //Save and test without call from API
        msg = "David Test 1 2 3" ;
        phone =  "+17814055794" ;
        //phone = "+447793811714" ; // Andrew
        //phone= /^\+?[1-9]\d{1,14}$/.test(phone) ;
        //phone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phone);
    } else {
        msg = req.params.msg ;
        phone = req.params.phone ;
    }
    //log ("Blandy, please let David know you got this. Thanks.");
    sendSMS(msg, phone);
}

function sendSMS(msg, phone){
    var options = {
    "auth":{
        user: TWILLIOSID,
        pass : TWILLIOAUTH
    },
    uri : "https://api.twilio.com/2010-04-01/Accounts/" + TWILLIOSID + "/SMS/Messages.json",
    "body":{
        "Body" : encodeURI(msg),
        "To" : phone.replace("+", "%2B"),
        "From": TWILLIOPHONE
    },
    "form":true
};

log(JSON.stringify(options));

    var requestObject = ClearBlade.http().Request();
    requestObject.post(options,function(err,result){
        if(err){
            log("sendSMS Failed: "+ err);
            _resp.error("sendSMS Failed: " + err);
        }else{
            log(result);
            _resp.success(result);
        }
    });   
}


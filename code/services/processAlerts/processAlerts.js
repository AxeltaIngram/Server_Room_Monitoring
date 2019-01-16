function processAlerts(req, resp) {
  log(req);
  ClearBlade.init({request:req})

  var codeEngine = ClearBlade.Code()
  var serviceToCall = "sendMessage"
  var params = {
    customer_id:"2843b40d-b3e5-4f4c-9f5f-9ac8d2709ec8",
    messageTypes:["sms","email","internal"],
    userEmails:["aallsbrook@clearblade.com","cbynum@clearblade.com"],
    payload:"Good news, something happened twice"
  }
  codeEngine.execute(serviceToCall, params, false, function(err, data){
    if(err){
      resp.error("Failed to complete my service: " + JSON.stringify(data))
    }
    resp.success("Yay! Here is my response: " + JSON.stringify(data))
  })
  // resp.success('Success');
}

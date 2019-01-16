function sendMessage(req, resp) {
  // testParams={
  //   customer_id:"2843b40d-b3e5-4f4c-9f5f-9ac8d2709ec8",
  //   messageTypes:["internal"],//["sms","email","internal"],
  //   userEmails:["cbynum@clearblade.com","aalcott@clearblade.com"],
  //   payload:"Here is a message"
  // }
  // req.params = testParams;
  log(req)
  ClearBlade.init({request:req});
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
  }
  
  var sendSMS = function(employee){
    var text = req.params.payload+"   https://goo.gl/rqsPH4";
    var recipientNumber = employee.phone_number;
    log("To Number:"+recipientNumber);
    var twconf = TWILIO_CONFIG;
    var twilio = Twilio(twconf.USER, twconf.PASS, twconf.SOURCE_NUMBER);
    
    twilio.sendSMS(text, recipientNumber, callback);
    
    function callback(err, data){
      if(err){
        log(err);
      }
      log('sent sms; body = ')
      log(JSON.stringify(data));
    }
  }

  var sendEmail = function(employee) {
    log("Email Function OBJ "+JSON.stringify(employee) );
    var codeEngine = ClearBlade.Code();
    var loggingEnabled = true;
    var parameters = {"email":employee.email,
                      "message":req.params.payload
                      };
    codeEngine.execute("mailService", parameters, loggingEnabled,function(err,data){
        if(err)
        {
         resp.error("ERROR "+ err);
        }else{
       log("Email Response "+ JSON.stringify(data));
        }
    });
  }

  var msg = ClearBlade.Messaging();
  var sendInternal = function(sender, employee) {
    var topic = "/messaging/"+employee.user_id+"/";
    log("messaging on topic "+topic+ "   with payload: "+req.params.payload);
    var customPayload = {
      "text":req.params.payload,
      "senderName":sender.first_name+" "+sender.last_name,
      "avatar":sender.photo
    }
    msg.publish(topic,JSON.stringify(customPayload));
  }
  var sendAllMessages = function(employees){
    var messageCount = 0 ; 
    log("employees");
    log(JSON.stringify(employees))
    for (var i=0 ; i < req.params.messageTypes.length; i++){
      var messageType = req.params.messageTypes[i];
      var sender = {
        first_name:"Immonit",
        last_name:"Sensor",
        photo : "https://static.thenounproject.com/png/1929560-200.png"
      };
      for (var j=0; j<employees.length;j++){
        var employee = employees[j]
        if (employee.email == req.userEmail){
          sender = employee;
          break;
        }
      }
      for (var j=0; j<employees.length;j++){
        
        var employee = employees[j]
        if (messageType== "sms"){
          log("sending sms")
          if (employee.userEmail!= req.userEmail){
            sendSMS(employee);
            messageCount++;
          }
          
        }else if (messageType=="email"){
          log("Email ");
          if (employee.userEmail!= req.userEmail){
            log("sending email");
            sendEmail(employee);
            messageCount++;
          }
        }else if(messageType=="internal"){
          log("sending internal")
          sendInternal(sender, employee);
          messageCount++;
        }
      }
      
    }
    response.message = messageCount+" messages were sent";
    sendResponse();
  }

  var getUsersByEmail = function(){
    var user = ClearBlade.User();
    var rootQuery = ClearBlade.Query();
    //if(isADAPTER) dont get the email
    // log("step 2 User Emails"+req.userEmail);
    // rootQuery.equalTo("email", req.userEmail);  
    var userEmails = stringToJSONConveter(req.params.userEmails);
    for (var i =0; i<userEmails.length; i++){
      log("loop "+i + "User Email "+ userEmails[i]);
      var query = ClearBlade.Query();
      query.equalTo("email", userEmails[i]);
      query.equalTo("customer_id", req.params.customer_id);
      rootQuery.or(query);
    }
    log("Root Query "+JSON.stringify(rootQuery) )
    //rootQuery.setPage(req.params.pageSize, req.params.pageNum);
    user.allUsers(rootQuery, function(err, data) {
      //resp.success(data)
      log("user list");
      //log("User Data >> "+JSON.stringify(data) )
      sendAllMessages(data.Data)
    });
  }
  //get all the user objects
  getUsersByEmail();
  //
  
}

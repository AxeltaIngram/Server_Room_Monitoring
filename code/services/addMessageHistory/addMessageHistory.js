function addMessageHistory(req, resp) {
  var reqParams = req.params;
  ClearBlade.init({ request: req });
  var currentDate = new Date();
  var currentTimestamp = new Date(Date.now()).toISOString();
  if(reqParams.hasOwnProperty("from_email_id") && reqParams.hasOwnProperty("to_email_id") 
        && reqParams.hasOwnProperty("message") && reqParams.hasOwnProperty("priority")){
    var rowObject ={};
    var callback = function (err, data) {
      if (err) {
        resp.error("Data insertion Error ");
      } else {
        resp.success(data);
      }

    };
    rowObject.from_email_id = reqParams.from_email_id;
    rowObject.to_email_id = reqParams.to_email_id;
    rowObject.message = reqParams.message;
    rowObject.priority = reqParams.priority;
    rowObject.sent_date = currentTimestamp;
    var col = ClearBlade.Collection({ collectionName: "MessagesHistory" });
    col.create(rowObject,callback);
  }
  else{
    resp.error("Invalid Parameters!");
  }
}

function getMessagesHistory(req, resp) {
  var paramObj = req.params;
  if(paramObj.hasOwnProperty("email_id")){
    var email_id = paramObj.email_id;
    ClearBlade.init({request:req});
    var callback = function (err, data) {
      if (err) {	
        resp.error("ERROR in fetching Data..!");
      } else {
        resp.success(data);
      }
    };
    var col = ClearBlade.Collection({collectionName:"MessagesHistory"});
    var query1 = ClearBlade.Query()
	  var query2 = ClearBlade.Query()
    query1.equalTo('from_email_id',email_id)
  	query2.equalTo('to_email_id',email_id)
    var finalQuery = query1.or(query2)
    finalQuery.descending("sent_date");
    col.fetch(finalQuery, callback);
  }
  else{
    resp.error("Invalid Parameters.!");
  }
  
}

function getGatewayHistory(req, resp) {
  var testParams = {
    gateway_id:"904065",   //required
    // location_id:"",  //NOT WORKING 
    // customer_id:"",  //NOT WORKING 
    pageNum:1,          //optional
    pageSize:25       //optional
  };
  req.params = testParams;
  
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  ClearBlade.init({request:req});
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {	
      response.err= true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };
  var col = ClearBlade.Collection({collectionName:"gateways_data"});
  var query = ClearBlade.Query();
  query.ascending("reading_date");
  if (typeof req.params.gateway_id !="undefined" && req.params.gateway_id!="" ){
    query.equalTo("gateway_id", req.params.gateway_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}

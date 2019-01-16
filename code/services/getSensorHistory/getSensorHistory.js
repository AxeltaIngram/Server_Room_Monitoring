function getSensorHistory(req, resp) {
  var testParams = {
    sensor_id:"351530",  //required
    // gateway_id:"",  //NOT WORKING 
    // location_id:"",  //NOT WORKING 
    // customer_id:"",  //NOT WORKING 
    pageNum:1,          //optional
    pageSize:25       //optional
  };
  // req.params = testParams;
  
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
  var col = ClearBlade.Collection({collectionName:"sensors_data"});
  var query = ClearBlade.Query();
  query.ascending("reading_time");
  if (typeof req.params.sensor_id !="undefined" && req.params.sensor_id!="" ){
    query.equalTo("sensor_id", req.params.sensor_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}

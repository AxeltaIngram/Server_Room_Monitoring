function getSensors(req, resp) {
  var testParams = {
    sensor_id:"",  //optional
    sensor_type_id:"",//optional
    gateway_id:"",  //optional
    asset_id:"",    //optional
    location_id:"",  //optional
    customer_id:"",  //optional
    pageNum:0,          //optional
    pageSize:0       //optional
  };
  //req.params = testParams;
  
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
  var col = ClearBlade.Collection({collectionName:"Sensors"});
  var query = ClearBlade.Query();
  if (typeof req.params.sensor_id !="undefined" && req.params.sensor_id!="" ){
    query.equalTo("item_id", req.params.sensor_id);
  }
  if (typeof req.params.sensor_type_id !="undefined" && req.params.sensor_type_id!="" ){
    query.equalTo("sensor_type_id", req.params.sensor_type_id);
  }
  if (typeof req.params.gateway_id !="undefined" && req.params.gateway_id!="" ){
    query.equalTo("gateway_id", req.params.gateway_id);
  }
  if (typeof req.params.asset_id !="undefined" && req.params.asset_id!="" ){
    query.equalTo("asset_id", req.params.asset_id);
  }
  if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
    query.equalTo("location_id", req.params.location_id);
  }
  if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
    query.equalTo("customer_id", req.params.customer_id);
  }

  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}

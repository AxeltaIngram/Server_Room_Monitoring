function updateSensorType(req, resp) {
    var testParams = {
    sensor_type_id:"29baa45a-6c68-4457-8460-b8dddc02dcf6",
    sensor_type:{
        "name": "Temperature",
        "attributes": "degrees",
        "description":  "measures the temperature",
        "data_type": "int",
        "icon": "",
        "is_probe": false,
      },
  };
  // req.params = testParams;
  log(req.params)
  ClearBlade.init({request:req});
  
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
  }

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.sensor_type_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"SensorTypes"});
  col.update(query, req.params.sensor_type, callback);
}

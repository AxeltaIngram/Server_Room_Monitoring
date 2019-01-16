function updateSensor(req, resp) {
  var testParams = {
    sensor_id:"109b964a-f32b-4dab-a998-380b476c462f",
    sensor:{
      "contact_id": "",
      "created_date": null,
      "customer_id": "",
      "gateway_id": "",
      "last_active": null,
      "latest_payload": "abc",
      "location_id": "2342",
      "sensor_id": "345346",
      "sensor_label": "Coolio",
      "sensor_name": ""
    },
  };
  // req.params = testParams;
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
  query.equalTo('item_id', req.params.sensor_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"Sensors"});
  col.update(query, req.params.sensor, callback);
}

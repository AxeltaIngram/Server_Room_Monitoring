function updateTest(req, resp) {
  var testParams = {
    test_id:"e07829f9-e0aa-483c-89f5-5bdc3698db1e",
    test:{
      "asset_id": "",
      "customer_id": "",
      "description": "first test22",
      "end_date":"2018-09-20T17:54:49.042Z",
      "location_id": "Austin22",
      "name": "test1",
      "sensor_id": "sensorID1",
      "sensor_payload": "good",
      "tester_id": "testerID1",
      "type_id": "testID1"
      },
  };
  req.params = testParams;
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
  query.equalTo('item_id', req.params.test_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"Tests"});
  col.update(query, req.params.test, callback);
}

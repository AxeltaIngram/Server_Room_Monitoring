function createTest(req, resp) {
  // var testParams = {
  //   test: {
  //     "asset_id": "",
  //     "customer_id": "",
  //     "description": "first test",
  //     "end_date":"",
  //     "location_id": "Austin",
  //     "name": "test1",
  //     "sensor_id": "sensorID1",
  //     "sensor_payload": "good",
  //     "tester_id": "testerID1",
  //     "type_id": "testID1"
  //   }
  // };
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
   
    var callback = function (err, data) {
        if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
    };
    var col = ClearBlade.Collection( {collectionName: "Tests" } );
    var currentDate = new Date();
    var isoString = currentDate.toISOString();
    req.params.test.end_date=isoString;
    req.params.test.name=req.params.test.name + "-" + isoString;
    col.create(req.params.test, callback)
}

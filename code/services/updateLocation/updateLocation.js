function updateLocation(req, resp) {
  var testParams = {
    location_id:"3fbf0970-900d-4bcf-89fb-453675fb5fff",
    location:{
        "boundaries": "",
        "coordinate": "",
        "customer_id": "",
        "description": "",
        "icon": "",
        "location_type": "",
        "name": "Another new place"
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
  query.equalTo('item_id', req.params.location_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"Locations"});
  col.update(query, req.params.location, callback);
}

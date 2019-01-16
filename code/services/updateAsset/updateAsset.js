function updateAsset(req, resp) {
  var testParams = {
    asset_id:"427bc245-2dee-4020-85b0-fb56d7e148da",
    asset:{
      "asset_type_id": "9999",
      "comments": "testing",
      "customer_id": "99999",
      "location_id": "99999",
      "name": "Bobs Refrigerator9",
      "primary_employee": "b@b.com"
    },
  };
  // req.params = testParams;
  ClearBlade.init({request:req});
  
  var response = {
    err:false,
    message:"",
    payload:{}
  }
  log("5")
  var sendResponse = function() {
    log("9");
    resp.success(response)
  }

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.asset_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"Assets"});
  col.update(query, req.params.asset, callback);
}

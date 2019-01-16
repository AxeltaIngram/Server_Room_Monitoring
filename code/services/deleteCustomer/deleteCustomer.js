function deleteCustomer(req, resp) {
  var testParams = {
    customer_id:"c5aa2126-14fb-4e5e-9192-e9e2953e56fc"
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
  query.equalTo('item_id', req.params.customer_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"Customers"});
  col.remove(query, callback);
}

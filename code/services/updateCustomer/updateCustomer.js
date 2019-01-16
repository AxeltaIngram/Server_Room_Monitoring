function updateCustomer(req, resp) {

   var testParams = {
    customer_id:"c5aa2126-14fb-4e5e-9192-e9e2953e56fc",
    customer:{
      "address": "101 main street",
      "city": "Austin",
      "contact_id": "",
      "country": "usa",
      "icon": "",
      "name": "ACME Doughnuts",
      "state": "TX",
      "zipcode": "78703"
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
  col.update(query, req.params.customer, callback);
}

function createCustomer(req, resp) {
  var testParams = {
    customer:{
      "address": "101 main street",
      "city": "Austin",
      "contact_id": "",
      "country": "usa",
      "icon": "",
      "name": "ACME Doughnuts",
      "state": "TX",
      "zipcode": "78701"
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
   
    var callback = function (err, data) {
        if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
    };
    var col = ClearBlade.Collection( {collectionName: "Customers" } );
    col.create(req.params.customer, callback);
}

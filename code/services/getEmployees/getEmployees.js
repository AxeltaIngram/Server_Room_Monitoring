function getEmployees(req, resp) {
  var testParams = {
    employee_id:"",  //optional
    pageNum:0,          //optional
    pageSize:0,       //optional
    customer_id:""
  };
  // req.params = testParams;
  
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
  var user = ClearBlade.User();
  var query = ClearBlade.Query();
  if (typeof req.params.employee_id !="undefined" && req.params.employee_id!="" ){
    query.equalTo("user_id", req.params.employee_id);
  }
  if (typeof req.params.email !="undefined" && req.params.email!="" ){
    query.equalTo("email", req.params.email);
  }
  if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
    query.equalTo("customer_id", req.params.customer_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);
  user.allUsers(query, function(err, data) {
    response.payload = data.Data
		sendResponse();
	});
}

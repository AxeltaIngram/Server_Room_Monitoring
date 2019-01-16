function updateEmployee(req, resp) {
  var testParams = {
    email: "b@b.com",
    employee: {
      "assets": "asdf",
      "customer_id": "wevev",
      "first_name": "To2m",
      "last_name": "Smit2h",
      "locations": "big pl22aces",
      "phone_number": "512222222",
      "photo": "",
    },
  };
  // req.params = testParams;
  ClearBlade.init({ request: req });
  log(req.params)

  var response = {
    err: false,
    message: "",
    payload: {}
  }

  var sendResponse = function () {
    resp.success(response)
  }

  var user = ClearBlade.User();
  var query = ClearBlade.Query();
  query.equalTo("email", req.params.email);
  user.setUsers(query, req.params.employee, function (err, data) {
    response.payload = data;
    sendResponse();
  });
}

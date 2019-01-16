function deleteEmployee(req, resp) {
  var testParams = {
    email: "b@b.com",
    employee: {
      "assets": "DELETED",
      "customer_id": "DELETED",
      "first_name": "DELETED",
      "last_name": "DELETED",
      "locations": "DELETED",
      "phone_number": "DELETED",
      "photo": "DELETED",
    },
  };
  // req.params = testParams;
  ClearBlade.init({ request: req });

  var response = {
    err: false,
    message: "",
    payload: {}
  }

  var user = ClearBlade.User();
  var changes = {
    "assets": "DELETED",
      "customer_id": "DELETED",
      "first_name": "DELETED",
      "last_name": "DELETED",
      "locations": "DELETED",
      "phone_number": "DELETED",
      "photo": "DELETED",
  };

  var q = ClearBlade.Query().equalTo("email", req.params.email);
  user.setUsers(q, changes, function (err, bod) {
    if (err) {
      resp.error("error changing user: " + JSON.stringify(bod));
    } else {
      log("success body:" + JSON.stringify(bod));
      response.payload = bod
      resp.success(response);
    }
  });

}

function createEmployee(req, resp) {
  var testParams = {
    user: {
      "email": "abda@c.com",
      "password": "b",
    },
    employee: {
      "assets": "asdf",
      "customer_id": "wevev",
      "first_name": "Tom",
      "last_name": "Smith",
      "locations": "big places",
      "phone_number": "91911231212",
      "photo": "",
    },
  };
  // req.params = testParams;
  ClearBlade.init({ request: req });

  var response = {
    err: false,
    message: "",
    payload: []
  }

  var sendResponse = function () {
    resp.success(response)
  }

  if (req.params.employee) {
    req.params.employees = [{ user: req.params.user, employee: req.params.employee }]
  }

  log(req.params.employees)

  req.params.employees.forEach(function (item) {
    if (!item.user.email) {
      response.err = true
      response.message = 'email cannot be blank'
      sendResponse()
    }
    ClearBlade.init({
      systemKey: req.systemKey,
      systemSecret: req.systemSecret,
      registerUser: true,
      email: item.user.email,
      password: item.user.password,
      callback: function (err, body) {
        if (err) {
          response.err = true;
          response.message = body;
          sendResponse();
        } else {
          ClearBlade.init({ request: req });
          var user = ClearBlade.User();
          var query = ClearBlade.Query();
          query.equalTo("email", item.user.email);
          user.setUsers(query, item.employee, function (err, data) {
            response.payload = data;
            sendResponse();
          });

        }

      }
    });
  })
}

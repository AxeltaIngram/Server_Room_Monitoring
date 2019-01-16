function createFoodTestType(req, resp) {
  var testParams = {
    food_test_type: {
      name: 'asdf'
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

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
      sendResponse();
    } else {
      response.payload.push(data[0].item_id)
      if (response.payload.length === req.params.food_test_types.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "FoodTestTypes" });
  if (req.params.food_test_type) {
    req.params.food_test_types = [req.params.food_test_type]
  }
  req.params.food_test_types.forEach(function (loc) {
    col.create(loc, callback);
  })
}

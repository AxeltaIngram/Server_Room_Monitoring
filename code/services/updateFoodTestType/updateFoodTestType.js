function updateFoodTestType(req, resp) {
  var testParams = {
    food_test_type_id: '9df4f3f4-dc6f-4bc9-b102-751f5fa5068d',
    food_test_type: {
      name: 'boo',
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

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.food_test_type_id);

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };

  var col = ClearBlade.Collection({ collectionName: "FoodTestTypes" });
  col.update(query, req.params.food_test_type, callback);
}

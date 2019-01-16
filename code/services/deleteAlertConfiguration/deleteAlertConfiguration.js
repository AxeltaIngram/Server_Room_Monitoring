function deleteAlertConfiguration(req, resp) {
  var testParams = {
    item_id: "9a7ad46d-bfb7-49f0-b434-8d9ceeec75ae"
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
  query.equalTo('item_id', req.params.item_id);

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };

  var col = ClearBlade.Collection({ collectionName: "AlertConfigurations" });
  col.remove(query, callback);

}

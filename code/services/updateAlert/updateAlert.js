function updateAlert(req, resp) {
  var testParams = {
    item_id: '3c8d2eaa-ec41-402b-8b4a-7e0e5605f167',
    alert: {
      is_active: false,
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

  var col = ClearBlade.Collection({ collectionName: "Alerts" });
  col.update(query, req.params.alert, callback);
}

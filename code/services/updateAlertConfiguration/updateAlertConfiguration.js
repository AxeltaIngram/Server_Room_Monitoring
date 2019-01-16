function updateAlertConfiguration(req, resp) {
  var testParams = {
    item_id: 'cd920c12-bad2-458d-948c-f79447582cd6',
    alertConfiguration: {
      name: '',
      type_id: '',
      rules: '[]',
      contacts: '[]',
      contact_method: '',
      priority: 'low',
      disabled: false,
      customer_id: '',
      timeout: 0,
      message: ''
    },
  };
  // req.params = testParams;
  ClearBlade.init({ request: req });

  var response = {
    err: false,
    message: "",
    payload: {}
  }
  log("5")
  var sendResponse = function () {
    log("9");
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
    log(data)
    sendResponse();
  };

  var col = ClearBlade.Collection({ collectionName: "AlertConfigurations" });
  log(req.params.alertConfiguration)
  col.update(query, req.params.alertConfiguration, callback);
}

function createAlertConfiguration(req, resp) {
  var testParams = {
    alertConfiguration: {
      name: ' ',
      type_id: ' ',
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
  log(req.params)
  // req.params = testParams;
  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: {}
  }

  var sendResponse = function () {
    resp.success(response)
  }

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
  col.create(req.params.alertConfiguration, callback);
}

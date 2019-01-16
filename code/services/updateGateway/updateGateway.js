function updateGateway(req, resp) {
  var testParams = {
    gateway_id: "5d7b725e-2fea-48bc-831e-84e646b843fb",
    gateway: {
      "gateway_name": "9999",
    },
  };
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

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.gateway_id);

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };

  var col = ClearBlade.Collection({ collectionName: "Gateways" });
  col.update(query, req.params.gateway, callback);
}

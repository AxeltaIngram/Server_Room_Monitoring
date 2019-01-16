function updateLocationType(req, resp) {
  var testParams = {
    location_type_id: "dca2be4e-cbb2-43dc-b106-caec7f306f33",
    location_type: {
      "name": "asdf"
    },
  };
  // req.params = testParams;
  log(req.params)
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
  query.equalTo('item_id', req.params.location_type_id);

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };

  var col = ClearBlade.Collection({ collectionName: "LocationTypes" });
  col.update(query, req.params.location_type, callback);
}

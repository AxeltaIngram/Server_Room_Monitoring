function updateAssetType(req, resp) {
  var testParams = {
    asset_type_id: "310326d7-dbbf-471c-b5be-bbc85f72668a",
    asset_type: {
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
  query.equalTo('item_id', req.params.asset_type_id);

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };

  var col = ClearBlade.Collection({ collectionName: "AssetTypes" });
  col.update(query, req.params.asset_type, callback);
}

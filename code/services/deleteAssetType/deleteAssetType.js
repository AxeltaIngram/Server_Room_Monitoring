function deleteAssetType(req, resp) {
  var testParams = {
    asset_type_id: "110fa81e-3682-4c74-8de8-d4b2987a0570"
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
  col.remove(query, callback);
}

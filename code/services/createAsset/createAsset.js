function createAsset(req, resp) {
  var testParams = {
    asset: {
      "asset_type_id": "",
      "comments": "asdf",
      "customer_id": "234234",
      "location_id": "23423",
      "name": "Bobs Refrigerator",
      "primary_employee": "b@b.com"
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
      if (response.payload.length === req.params.assets.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "Assets" });
  if (req.params.asset) {
    req.params.assets = [req.params.asset]
  }
  req.params.assets.forEach(function (item) {
    if (!item.name) {
      response.err = true
      response.message = 'name cannot be blank'
      sendResponse()
    }
    col.create(item, callback);
  })
}

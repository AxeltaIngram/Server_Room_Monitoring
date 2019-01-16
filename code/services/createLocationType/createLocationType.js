function createLocationType(req, resp) {
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
      if (response.payload.length === req.params.location_types.length) {
        sendResponse();
      }
    }
  };
  function hasRequiredFields(item, requiredFields) {
    requiredFields.forEach(function (keyName) {
      if (!item[keyName]) {
        response.err = true
        response.message = keyName + ' cannot be blank'
        sendResponse()
      }
    })
  }
  var col = ClearBlade.Collection({ collectionName: "LocationTypes" });
  if (req.params.location_type) {
    req.params.location_types = [req.params.location_type]
  }
  log(JSON.stringify(req.params, null, 2))
  req.params.location_types.forEach(function (item) {
    hasRequiredFields(item, ['name'])
    col.create(item, callback);
  })
}

function createSensorType(req, resp) {
  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: []
  }

  var sendResponse = function () {
    resp.success(response)
  }
  function hasRequiredFields(item, requiredFields) {
  requiredFields.forEach(function (keyName) {
    if (!item[keyName]) {
      response.err = true
      response.message = keyName + ' cannot be blank'
      sendResponse()
    }
  })
}

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
      sendResponse();
    } else {
      response.payload.push(data[0].item_id)
      if (response.payload.length === req.params.sensor_types.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "SensorTypes" });
  if (req.params.sensor_type) {
    req.params.sensor_types = [req.params.sensor_type]
  }
  log(JSON.stringify(req.params, null, 2))
  req.params.sensor_types.forEach(function (item) {
    hasRequiredFields(item, ['name', 'data_type'])
    col.create(item, callback);
  })
}

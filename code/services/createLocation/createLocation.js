function createLocation(req, resp) {
  // var testParams = {
  //   location: {
  //     "name":"Bobbys place",
  //     "description":"Main Street Shop",
  //     "boundaries": "",
  //     "customer_id": "",
  //     "icon": "",
  //     "location_type": ""
  //   }
  // };
  // req.params = testParams;

  ClearBlade.init({ request: req });
  log(req.params)
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
      if (response.payload.length === req.params.locations.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "Locations" });
  if (req.params.location) {
    req.params.locations = [req.params.location]
  }
  req.params.locations.forEach(function (item) {
    hasRequiredFields(item, ['name', 'lat', 'long'])
    col.create(item, callback);
  })
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

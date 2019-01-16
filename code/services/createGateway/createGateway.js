function createGateway(req, resp) {
  var testParams = {
    gateway: {
      "battery_level": "100",
      "customer_id": "2843b40d-b3e5-4f4c-9f5f-9ac8d2709ec8",
      "employee_id": "t@m.com",
      "gateway_description": "asd",
      "gateway_id": "222222",
      "gateway_label": "asd",
      "gateway_name": "CGW3 3g North America - 222222",
      "location_id": "ae9cd9b7-6c6c-491e-87dc-2efb6e58b567",
      "network_id": "5",
      "notes": "asd",
      "signal_strength": "22"
    },
  };
  // req.params = testParams;
  log(req.params)
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
      if (response.payload.length === req.params.gateways.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "Gateways" });
  if (req.params.gateway) {
    req.params.gateways = [req.params.gateway]
  }
  req.params.gateways.forEach(function (item) {
    if (!item.gateway_id) {
      response.err = true
      response.message = 'gateway_id cannot be blank'
      sendResponse()
    }
    hasRequiredFields(item, ['gateway_id', 'gateway_name'])
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

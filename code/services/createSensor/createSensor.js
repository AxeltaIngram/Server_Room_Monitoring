function createSensor(req, resp) {
  var testParams = {
    "sensor": {
      "battery_level": "100",
      "last_active": "2018-09-20T21:10:40Z",
      "latest_payload": "{\"battery_level\":100,\"item_id\":\"b5eeffc3-63ae-4718-8b70-1646b1171460\",\"reading_time\":\"2018-09-20T21:10:40Z\",\"sensor_id\":111111,\"sensor_name\":\"Temp- 111111\",\"sensor_reading\":\"22.4\",\"signal_strength\":100}",
      "sensor_id": "111111",
      "sensor_label": "My Temp Sensor",
      "sensor_name": "Temp- 111111",
      "sensor_type_id": "19637d5b-3782-48dc-8259-794488a89d73",
      "signal_strength": "100",
      "created_date": "2018-10-05T18:33:30.102Z"
    }
  };
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
      if (response.payload.length === req.params.sensors.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "Sensors" });
  if (req.params.sensor) {
    req.params.sensors = [req.params.sensor]
  }
  req.params.sensors.forEach(function (item) {
    item.created_date = item.created_date || new Date(Date.now()).toISOString()
    col.create(item, callback);
  })
}

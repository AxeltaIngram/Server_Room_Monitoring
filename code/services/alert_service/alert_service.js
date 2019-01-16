function alert_service(req, resp) {
  ClearBlade.init(req);
  log(req);

  var alert = {
    "sensor_id": "test",
    "rule": "Pink Temperature",
    "color": "#7698D3"
  }

  if (req.params.body) {
    var body = JSON.parse(req.params.body);
    alert.sensor_id = body.sensor_message.sensorID;  //placeholder 
    alert.rule = req.params.ruleName;
  }

  var topic = "alert/" + alert.sensor_id;
  log("topic is: " + topic);
  var msg = ClearBlade.Messaging();
  msg.publish(topic, JSON.stringify(alert));

  resp.success(alert);
}

// gets recent 'sensors_data' that is missing a entry in the 'Sensors' table
function getOrphanSensorData(req, resp) {
  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: {}
  }
  var col = ClearBlade.Collection({ collectionName: "Sensors" });
  var query = ClearBlade.Query();

  query.columns(['sensor_id'])
  col.fetch(query, function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    var sensorsWithMetaData = response.payload.DATA.map(function (arg) { return arg.sensor_id })
    log(sensorsWithMetaData)
    var col = ClearBlade.Collection({ collectionName: "sensors_data" });
    var dQuery = ClearBlade.Query();
    sensorsWithMetaData.forEach(function(s) {
      dQuery.notEqualTo('sensor_id', s)
    })
    dQuery.descending("reading_time");
    dQuery.setPage(3, 1);
    col.fetch(dQuery, function (err, data) {
      resp.success(data)
    })
  });
}

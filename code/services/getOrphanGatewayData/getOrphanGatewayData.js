// gets recent 'gateways_data' that is missing a entry in the 'Gateways' table
function getOrphanGatewayData(req, resp) {
  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: {}
  }
  var col = ClearBlade.Collection({ collectionName: "Gateways" });
  var query = ClearBlade.Query();

  query.columns(['gateway_id'])
  col.fetch(query, function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    log(response)
    var gatewaysWithMetaData = response.payload.DATA.map(function (arg) { return arg.gateway_id })
    var col = ClearBlade.Collection({ collectionName: "gateways_data" });
    var dQuery = ClearBlade.Query();
    gatewaysWithMetaData.forEach(function(s) {
      dQuery.notEqualTo('gateway_id', s)
    })
    dQuery.descending("reading_date");
    dQuery.setPage(3, 1);
    col.fetch(dQuery, function (err, data) {
      resp.success(data)
    })
  });
}

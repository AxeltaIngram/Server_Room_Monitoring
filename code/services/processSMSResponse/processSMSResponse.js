/**
 * @returns body contents of SMS Response
 * @return sender phone number, in Twilio format
 */
function processSMSResponse(req, resp) {
  log(req)
  var p = req.params;
  const body = JSON.parse(p.body);
  if (!body.body) {
    resp.success('Invalid request');
  }
  const parsedBody = convertQueryStringToObject(body.body);
  log({parsedBody})
  const body = parsedBody.Body;
  const sender = parsedBody.From;
  // var body = extractBodyFromMQTTMessage(p)
  // var sender = extractSenderFromMQTTMessage(p)
  log({ body, sender })
  resp.success("DOne")


  // function extractSenderFromMQTTMessage(params) {
  //   try {
  //     var MQTTBody = JSON.parse(req.params.body)
  //     // log({MQTTBody})
  //     var delimitedMessage = MQTTBody.body;
  //     log(delimitedMessage)
  //     messageSections = delimitedMessage.split('&')
  //     if (messageSections.length !== 20) {
  //       resp.error("Invalid message body URL params")
  //     }
  //     bodyClause = messageSections[18]
  //     bodySections = bodyClause.split('=')
  //     if (bodySections.length !== 2) {
  //       resp.error("Did not find valid Body param in URL")
  //     }
  //     var body = bodySections[1]
  //     return body;

  //   }
  //   catch (e) {
  //     resp.error("Failed to parse")
  //   }
  // }

  // function extractBodyFromMQTTMessage(params) {
  //   try {
  //     var MQTTBody = JSON.parse(req.params.body)
  //     // log({MQTTBody})
  //     var delimitedMessage = MQTTBody.body;
  //     log(delimitedMessage)
  //     messageSections = delimitedMessage.split('&')
  //     if (messageSections.length !== 20) {
  //       resp.error("Invalid message body URL params")
  //     }
  //     bodyClause = messageSections[10]
  //     bodySections = bodyClause.split('=')
  //     if (bodySections.length !== 2) {
  //       resp.error("Did not find valid Body param in URL")
  //     }
  //     var body = bodySections[1]
  //     return body;

  //   }
  //   catch (e) {
  //     resp.error("Failed to parse")
  //   }
  // }
}

function convertQueryStringToObject(query) {
  return query.split("&").reduce(function (prev, curr, i, arr) {
    var p = curr.split("=");
    prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
    return prev;
  }, {});
}
var currentSensor = {}
function getCurrentSensor(sensor_id) {
  var col = ClearBlade.Collection({ collectionName: "Sensors" })
  var query = ClearBlade.Query()
  query.equalTo("sensor_id", sensor_id)
  var checkForExistingCallback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      currentSensor = data.DATA[0];
    }
  }
  col.fetch(query, checkForExistingCallback)
}

function parsePayload(currentSensor, rule) {
  var payload = currentSensor.latest_payload;
  if (rule.property === 'battery_level') {
    // only two options now for property and defaults to sensor_reading/latest_payload
    payload = currentSensor.battery_level;
  }
  if (payload == "True") {
    payload = true;
  } else if (payload == "False") {
    payload = false;
  } else {
    var vals = payload.split("|")
    payload = vals[vals.length - 1];
    payload = parseInt(payload)
  }
  return payload
}

function checkAlertViolated(alertConfig) {
  if(!alertConfig) return false
  if (!alertConfig.disabled) {
    var ruleViolated = false;
    var rules = JSON.parse(alertConfig.rules)
    log("NUM RULES " + rules.length)
    rules.forEach(function (rule, i) {
      getCurrentSensor(rule.sensor_id)

      var payload = parsePayload(currentSensor, rule)
      var ruleValue = JSON.parse(rule.value)

      if (rule.operator == "GT") {
        ruleViolated = payload > ruleValue;
      } else if (rule.operator === "LT") {
        ruleViolated = payload < ruleValue;
      } else if (rule.operator === "EQ") {
        ruleViolated = payload === ruleValue;
      }

      log("rule" + (i + 1) + (ruleViolated ? " was violated:" : " is fine:     ") + " payload " + payload + " cannot be " + rule.operator + " ruleValue " + ruleValue)
    })
  }
  return ruleViolated
}
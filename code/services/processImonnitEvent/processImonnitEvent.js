function processImonnitEvent(req, resp) {
 // log("Req " + JSON.stringify(req));
  // var testParams = {
  //   "sensor_message": {
  //     "applicationID": "2",
  //     "batteryLevel": "100",
  //     "dataMessageGUID": "f3a8eada-9a3a-461b-aab3-a6bb41f1d0ee",
  //     "dataType": "TemperatureData",pa
  //     "dataValue": "22.4",
  //     "messageDate": "2018-09-20 21:10:40",
  //     "networkID": "5",
  //     "pendingChange": "True",
  //     "plotLabels": "Celsius",
  //     "plotValues": "22.4",
  //     "rawData": "22.4",
  //     "sensorID": "111111",
  //     "sensorName": "Temp- 111111",
  //     "signalStrength": "100",
  //     "state": "16"
  //   },
  //   "gateway_message": {
  //     "accountID": "3",
  //     "batteryLevel": "101",
  //     "count": "69",
  //     "date": "2018-09-20 21:12:16",
  //     "gatewayID": "222222",
  //     "gatewayName": "CGW3 3g North America - 222222",
  //     "messageType": "0",
  //     "networkID": "5",
  //     "pendingChange": "False",
  //     "power": "0",
  //     "signalStrength": "22"
  //   },
  //   "time_received": "2018-09-20T21:12:33Z"
  // }
  // req.params.body = JSON.stringify(testParams);
  ClearBlade.init({ request: req });
  var currentDate = new Date();
  var imonnitData = typeof req.params.body == 'string' ? JSON.parse(req.params.body) : req.params.body;
  
  var gatewayObj = imonnitData.gateway_message;
  var sensorObj = imonnitData.sensor_message;
  var gatewayMsgObj = {
    "gateway_id": parseInt(gatewayObj.gatewayID),
    "network_id": parseFloat(gatewayObj.networkID),
    "gateway_name": gatewayObj.gatewayName,
    "battery_level": parseInt(gatewayObj.batteryLevel),
    "signal_strength": parseInt(gatewayObj.signalStrength),
    "reading_date": gatewayObj.date
  };
  var sensorMsgObj = {
    "sensor_id": parseInt(sensorObj.sensorID),
    "sensor_name": sensorObj.sensorName,
    "sensor_reading": sensorObj.dataValue,
    "battery_level": parseInt(sensorObj.batteryLevel),
    "signal_strength": parseInt(sensorObj.signalStrength),
    "reading_time": sensorObj.messageDate,
    "gateway_id": parseInt(gatewayObj.gatewayID)
  };
  log("sensor msg");
  var sensorRecord = {
    "last_active": new Date(Date.now()).toISOString(),
    "latest_payload": sensorMsgObj.sensor_reading,
    "sensor_name": sensorMsgObj.sensor_name,
    "gateway_id": gatewayMsgObj.gateway_id,
    "battery_level": sensorObj.batteryLevel,
    "signal_strength": sensorObj.signalStrength
  }

  // log(sensorRecord);
  var gatewayRecord = {
    //"last_active": req.params.time_received,
    "gateway_name": gatewayMsgObj.gateway_name,
    "network_id": gatewayMsgObj.network_id,
    "battery_level": gatewayObj.batteryLevel,
    "signal_strength": gatewayObj.signalStrength,
  }
  
  var response = {
    err: false,
    message: "",
    payload: {}
  }
  var sendResponse = function () {
    log(response)
    resp.success(response)
  }



  var updateSensor = function () {
    var query = ClearBlade.Query();
    query.equalTo('sensor_id', sensorObj.sensorID);
    // log(query)
    var callback = function (err, data) {
      // log("updateSensorCallback err: " + err)
      // log("updateSensorCallback data: " + data)
      if (err) {
        response.err = true;
        response.message = data;
        // log(response);
        createSensor()
      } else {
        response.payload = data;
        // log(response)
      }

    };

    var col = ClearBlade.Collection({ collectionName: "Sensors" });
    col.update(query, sensorRecord, callback);
  }

  var updateSensorHistory = function () {
    // log("updateSensorHistory")
    var callback = function (err, data) {
      // log("updateSensorHistoryCallback")
      if (err) {
        response.err = true;
        response.message = data;
      } else {
        response.payload = data;
      }
      // log(response)
    };
    var col = ClearBlade.Collection({ collectionName: "sensors_data" });

    col.create(sensorMsgObj, callback);
  }


  var updateGateway = function () {
    // log("updateGateway")
    var query = ClearBlade.Query();
    query.equalTo('gateway_id', gatewayObj.gatewayID);

    var callback = function (err, data) {
      // log("updateGatewayCallback")
      if (err) {
        response.err = true;
        response.message = data;
        // log(response)
        createGateway()
      } else {
        response.payload = data;
        // log(response)
      }
    };

    var col = ClearBlade.Collection({ collectionName: "Gateways" });
    col.update(query, gatewayRecord, callback);
  }

  var updateGatewayHistory = function () {
    // log("updateGatewayHistory")
    var callback = function (err, data) {
      // log("updateGatewayHistoryCallback")
      if (err) {
        response.err = true;
        response.message = data;
      } else {
        response.payload = data;
      }
      // log(response)
    };
    var col = ClearBlade.Collection({ collectionName: "gateways_data" });

    col.create(gatewayMsgObj, callback);
  }

  var sendMessage = function (config) {
    // log("sendingMessage started");
    var messageTypes = ["internal"];
    if (config.priority == "medium") {
      messageTypes.push("email");
    } else if (config.priority == "high") {
      messageTypes.push("email");
      messageTypes.push("sms");
    }
    var payload = "ALERT: " + config.name + " - " + config.message;
    log("Payload  "+payload)
    var msgObj ={};
    var rules = stringToJSONConveter(config.rules);
    var property = rules[0].property;
    msgObj.sensor_id = sensorMsgObj.sensor_id;
    msgObj.rules = rules ;
    msgObj.sensor_reading = sensorMsgObj.sensor_reading;
    msgObj[property] = sensorMsgObj[property];
    msgObj.message = config.message;
    var messageString ="";
    messageString = messageString + "<b> Sensor Id :</b> "+ sensorMsgObj.sensor_id +"<br/>";
    if(sensorMsgObj.hasOwnProperty("sensor_reading")){
      messageString = messageString + "<b> Sensor Reading : <b>"+ sensorMsgObj.sensor_reading+"<br/>";
    }
    if(config.hasOwnProperty("message")){
      messageString = messageString + "<b> Alert Message : </b>"+ config.message+"<br/>";
    }    

    log("Message Object "+ JSON.stringify(msgObj));

    //var targets = JSON.parse(config.contacts);
    var targets = config.contacts;
    var codeEngine = ClearBlade.Code()
    var serviceToCall = "sendMessage"
    var params = {
      customer_id: config.customer_id,
      messageTypes: messageTypes,
      userEmails : targets,
      messageObj : msgObj,
      payload: JSON.stringify(messageString)
    }
    codeEngine.execute(serviceToCall, params, false, function (err, data) {
      if (err) {
        //resp.error("Failed to complete my service: " + JSON.stringify(data))
        response.err = true;
        response.message = data;
        // log(response);
        //sendResponse();
      }
      // log("sendingMessage finished");
      //resp.success("Yay! Here is my response: " + JSON.stringify(data))
    });
  }
  existingAlertExists = false
  function checkForExistingAlerts (alertConfig) {
    existingAlertExists = false
    var col = ClearBlade.Collection({ collectionName: "Alerts" });
    var query = ClearBlade.Query();
    query.equalTo("is_active", true);
    query.equalTo("configuration_id", alertConfig.item_id)
    var checkForExistingCallback = function (err, data) {
      
      if (err) {
        response.err = true;
        response.message = data;
        // log(response);
      } else {
        response.payload = data.DATA;
        if (data.DATA.length > 0) {
          log("!!!Existing Alert Found" + JSON.stringify(data, null, 2))
          var item_id = data.DATA[0].item_id;
          updateAlertTable(item_id);
          existingAlertExists = true;
        }
      }
    }
    col.fetch(query, checkForExistingCallback);
    return existingAlertExists;
  }

  var createNewAlert = function (config) {
    config.type_id = "461b3ffd-b458-48e8-ac84-cf6a82866951";
    var currentTimestamp = new Date(Date.now()).toISOString();
    newAlert = {
      "configuration_id": config.item_id,
      "customer_id": config.customer_id,
      "is_active": true,
      "sent_date": currentTimestamp,
      "target_users": config.contacts,
      "type_id": config.type_id
    }
    var callback = function (err, data) {
      if (err) {
        response.err = true;
        response.message = data;
      } else {
        response.payload = data;
      }
      log('createNewAlert' + response);
    };
    var col = ClearBlade.Collection({ collectionName: "Alerts" });
    col.create(newAlert, callback);
  }



  // update Alert Table sent Time 
var updateAlertTable = function (item_id) {
    var currentTimestamp = new Date(Date.now()).toISOString();
    var updateCol ={}
    updateCol.sent_date = currentTimestamp;
    var callback = function (err, data) {
      if (err) {
        response.err = true;
        response.message = data;
      } else {
        log('Table Updated  ' +JSON.stringify(data) );
        response.payload = data;
      }
    };
    var col = ClearBlade.Collection({ collectionName: "Alerts" });
    var query = ClearBlade.Query();
    query.equalTo('item_id', item_id);
    col.update(query, updateCol, callback);
  }



  var checkAlert = function (matchingAlertConfigs) {
    for (var i = 0; i < matchingAlertConfigs.length; i++) {
      var alertConfig = matchingAlertConfigs[i];
      var ruleViolated = checkAlertViolated(alertConfig);
      var alrtConfigID = alertConfig.item_id;
      if (ruleViolated) {
        //make sure we dont have an existing alert
        var existingAlertExists = checkForExistingAlerts(alertConfig);
        log(alertConfig.name + ' BROKEN, ' + (existingAlertExists ? 'but existing alerts were found' : 'no existing alert'))
        if (!existingAlertExists) {
          log("IN Condition...! ---> existingAlertExists");
          createNewAlert(alertConfig);
          sendMessage(alertConfig);          
        }
        else{          
          log("Alert Configuration  "+JSON.stringify(alertConfig));                   
        }
      } else {
        log(alertConfig.name + ' NOT BROKEN')
      }
      response.payload = ruleViolated;
    }
    response.payload = []
    sendResponse();
  }

  var publishAlerts = function () {
    var col = ClearBlade.Collection({ collectionName: "AlertConfigurations" });
    var query = ClearBlade.Query();
    // query.matches("rules", "\"sensor_id\":\""+sensorObj.sensorID+"\"");
    query.matches("rules", sensorObj.sensorID);
    query.setPage(req.params.pageSize, req.params.pageNum);
    // log("query object for finding matching alert configs");
    // log(query)
    var getAlertsCallback = function (err, data) {
      if (err) {
        response.err = true;
        response.message = data;
        // log(response);
        sendResponse();
      } else {
        // log("alertConfig search results")
        // log(data)
        response.payload = data.DATA;
        // sendResponse();
        checkAlert(data.DATA);
      }

    }
    col.fetch(query, getAlertsCallback);
  }
  // log("updateSensor");
  updateSensor() // this should create the sensor if its not found
  // log("updateSensorHistory");
  updateSensorHistory()
  // log("updateGateway");
  updateGateway() //this should create the gateway if its not found
  // log("updateGatewayHistory");
  updateGatewayHistory()
  // log("publishAlerts");
  publishAlerts();
  // log("FINISHED");
  // resp.success('Success');
}




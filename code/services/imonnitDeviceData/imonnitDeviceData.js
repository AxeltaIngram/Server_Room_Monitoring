//To store the data into CB when adapter publishes MQTT message
//SUGG: Should use UUID generate in a library, rather than calling a codeservice
//TODO: Refer this for documenting constants http://usejsdoc.org/tags-constant.html
// @param is different than @constants or @globals
/**
 *@param {object} sensorObj - object to store into sensors_data collection
 *@param {object} gatewayObj - object to store into gateways_data collection
 */
var _resp, _req, reqObj, sensorObj, gatewayObj;
/**
 * @typedef imonnitDeviceData
 *  @param {object} req - monnit-webhook-adapter/sensorID message object
 *  @param {object} resp - response object.
 *  TODO : Stores new gateway/network/sensors details into devices_metadata,gateways_data,sensors_data and Sensors collections
 */


//TODO As the service is performing a bunch of actions, 
// it would be a good idea to modularize it using libraries, 
// also using helper functions to pre-process and format data can make it cleaner
// using promises instead of just using callbacks can make the code more readable and cleaner

/**
 * @typedef imonnitDeviceData
 *  @param {object} req - monnit-webhook-adapter/sensorID message object
 *  Stores new gateway/network/sensors details into devices_metadata,gateways_data,sensors_data and Sensors collections
 **/
function imonnitDeviceData(req, resp) {

    ClearBlade.init({ request: req });
    _resp = resp;
    _req = req;
    log("Adapter Msg: " + req.params.body);
    var d = new Date();
    //TODO try-catch when parsing json or accessing properties of objects.

    reqObj = JSON.parse(req.params.body); //need to add JSON.parse
    //TODO: Checks to verify if values are provided rather than directly assigning
    //and throwing error or logging (if tolerable)
    gatewayObj = reqObj.gateway_message;
    sensorObj = reqObj.sensor_message;

    log("Sensor value " + sensorObj.sensorID);
    if (gatewayObj.networkID != sensorObj.networkID) {
        var unrSnObj = {
            "device_id": parseInt(sensorObj.sensorID),
            "network_id": parseInt(sensorObj.networkID),
            "device_name": sensorObj.sensorName,
            "sensor_reading": sensorObj.dataValue,
            "battery_level": parseInt(sensorObj.batteryLevel),
            "signal_strength": parseInt(sensorObj.signalStrength),
            "reading_time": sensorObj.messageDate
        };
        //var unrGwObj={};
        createRecord(unrevealedDevicesData, unrSnObj);
        // createRecord(unrevealedDevicesData,unrSnObj);
    } else {

        //TODO: Verify that parseInt don't mess things up: Ex: parseInt("1010") => 1010 but parseInt("0x1010") => 4112
        //Good idea is to ensure what is expected: parseInt("1010",10), where the second arg is radix
        //TODO Also, need to add a check in case NaN or infinity values are not allowed
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
            "reading_time": sensorObj.messageDate
        };

        createNewDevice("devices_metadata", reqObj);
        //TODO creating helper functions with relevant names would be preferable than adding comments
        //to store Gateway Data
        var gcquery = ClearBlade.Query({ collectionName: gateways_data });
        var cdate = gatewayObj.date;
        gcquery.equalTo("reading_date", cdate);
        gcquery.equalTo("gateway_id", parseInt(gatewayObj.gatewayID));
        gcquery.fetch(function (err, data) {
            if (err) {
                resp.error("error1: " + data)
            } else {
                if (data.TOTAL === 0) {
                    createRecord(gateways_data, gatewayMsgObj);
                }
            }
        });

        //createRecord(gatewaysTable,gatewayMsgObj);

        //to store sensor data
        createRecord(sensors_data, sensorMsgObj);
        //TODO creating helper functions with relevant names would be preferable than adding comments

        //to store sensor details in Sensors collection
        var sensorDetailsQuery = ClearBlade.Query({ collectionName: Sensors });
        sensorDetailsQuery.equalTo("sensor_id", sensorMsgObj.sensor_id);
        sensorDetailsQuery.fetch(function (err, data) {
            if (err) {
                resp.error("error2: " + data)
            } else {
                if (data.TOTAL === 0) {
                    createRecord(Sensors,
                        {
                            "sensor_id": sensorMsgObj.sensor_id,
                            "sensor_name": sensorMsgObj.sensor_name,
                            "gateway_id": gatewayMsgObj.gateway_id
                        });
                }
            }
        });
    }
    //final response    
    _resp.success("success");
}

//TODO: need to check if keys exist, before assigning/using
/**
 * @typedef createNewDevice
 * @param {string} collectionName - into which collection data is getting stored
 * @param {json} deviceObj - object to store into collection
 * Do querying for network_id in request object and call deviceCallBack function 
 **/
function createNewDevice(collectionName, deviceObj) {

    var networkId, gatewayId, sensorId;

    networkId = deviceObj.gateway_message.networkID;
    gatewayId = deviceObj.gateway_message.gatewayID;
    sensorId = deviceObj.sensor_message.sensorID;

    log(networkId + " " + gatewayId + " " + sensorId);

    var query = ClearBlade.Query({ collectionName: collectionName });
    query.equalTo("network_id", deviceObj.gateway_message.networkID);
    query.fetch(deviceCallBack);

    //query.fetch(statusCallBack);
    //query.columns(["network_id", "gateway_id", "sensors"]);
}

//Create a record
/**
 * @typedef createRecord
 * Creates new item in given collection with gives values 
 * @param {string} tbl - into which collection data is getting stored
 * @param {json} values - object to store into collection
 **/
function createRecord(tbl, values) {
    var col = ClearBlade.Collection({ collectionName: tbl });
    col.create(values, statusCallBack);
}

//add new gateways and networks
/**
 * @typedef createGateways
 * Creates new item in devices_metadata collection 
 **/
function createGateways() {
    var networkUUID;
    var codeEngine = ClearBlade.Code();
    var serviceToCall = "UUIDgenerator";
    var loggingEnabled = true;
    var params = {
        "network_ID": parseInt(gatewayObj.networkID)
    };
    codeEngine.execute(serviceToCall, params, loggingEnabled, function (err, data) {
        if (err) {
            _resp.error("Failed to complete my service: " + JSON.stringify(data))
        } else {
            networkUUID = JSON.parse(data).results;
        }
    });

    var newDeviceObj = {
        "network_id": parseInt(gatewayObj.networkID),
        "network_uuid": networkUUID,
        "gateway_id": parseInt(gatewayObj.gatewayID),
        "gateway_name": gatewayObj.gatewayName,
        "sensors": JSON.stringify({ "sensorsList": [sensorObj.sensorID] }),
        "customer_name": JSON.stringify({ "users": ["ingram@axelta.com", "usman.minhas@ingrammicro.com"] })
    };
    log(newDeviceObj);
    var devicesMetaData = ClearBlade.Collection({ collectionName: devices_metadata });
    devicesMetaData.create(newDeviceObj, devicestatusCallBack);
}

//device data query callback
/**
 * @typedef deviceCallBack
 * It is a callback function.It checks gateway existancy in devices_metadata collection.If it is there it modifies item,if not it creates new item. 
 **/
var deviceCallBack = function (err, data) {
    if (err) {
        log("error3: " + JSON.stringify(data));
        _resp.error(data);
    } else {
        var queryResult = data;
        queryResult = queryResult.DATA
        log(data);

        if (queryResult.length > 0) {
            for (var i = 0; i < queryResult.length; i++) {
                log(i + " " + queryResult.length + " " + parseInt(gatewayObj.gatewayID) + " " + queryResult[i].gateway_id)
                if (queryResult[i].gateway_id === parseInt(gatewayObj.gatewayID)) {
                    var listOfSensors = JSON.parse(queryResult[i].sensors).sensorsList;
                    if (listOfSensors.indexOf(sensorObj.sensorID) < 0) {
                        listOfSensors.push(sensorObj.sensorID);
                        log(listOfSensors);
                        var query = ClearBlade.Query();
                        query.equalTo('gateway_id', parseInt(gatewayObj.gatewayID));
                        var changes = {
                            sensors: JSON.stringify({
                                "sensorsList": listOfSensors
                            })
                        };

                        var sensorUpdateObj = ClearBlade.Collection({ collectionName: devices_metadata });
                        sensorUpdateObj.update(query, changes, devicestatusCallBack);
                    }
                    break;
                } else {
                    if (i === queryResult.length - 1) {
                        createGateways();
                    }
                }
            }
        } else {

            createGateways();
        }
        //_resp.success(data);
    }
};

/**
 * @typedef statusCallBack
 * It is a callback function. 
 **/
var statusCallBack = function (err, data) {
    if (err) {
        log("error4: " + JSON.stringify(data));
        _resp.error(data);
    } else {
        log(data);

        //_resp.success(data);
    }
};

/**
 * @typedef devicestatusCallBack
 * It is a callback function. 
 **/
var devicestatusCallBack = function (err, data) {
    if (err) {
        log("errpr5: " + JSON.stringify(data));
        _resp.error(data);
    } else {
        log(data);

        //_resp.success(data);
    }
};

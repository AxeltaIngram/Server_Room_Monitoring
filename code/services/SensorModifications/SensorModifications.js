var response;
var auth_token;
/**
 * 	@typedef SensorModifications
 *  ADD / DELETE sensor in Imonnit and Clearblade platform
 *  @param {object} req - request object.It contains gateway_id,sensor_id,method parameters.
 *  @param {object} resp - response object.
 *  @param {string} req.params.gateway_id  - Gateway id
 *  @param {number} req.params.sensor_id   -  Sensor id.
 *  @param {string} req.params.method      -  insert/remove .
 *	@returns--
      ADD / DELETE sensor in Imonnit and Clearblade platform response
 **/
function SensorModifications(req, resp) {
  response = resp;
  var reqObj = req.params;
  var msg ={};
  ClearBlade.init({request:req});
  if(reqObj.hasOwnProperty("method") && reqObj.hasOwnProperty("sensor_id")  && reqObj.hasOwnProperty("gateway_id")){
    var method = reqObj.method;
    var gateway_id = reqObj.gateway_id;
    var sensor_id = reqObj.sensor_id;
    var network_id=reqObj.network_id;
    var auth_token= getImAuthKey(reqObj.username,reqObj.password);
    // if(gateway_id == 913201){
    //    auth_token=ax_auth;
    //   //  auth_token= getImAuthKey(userName,password);
    // }else{
    //     auth_token=superUser_auth;
    // }

    var URI="";
    var imonitResult;
      if(method == "remove"){
        if(gateway_id == 913201){
          URI = "https://www.imonnit.com/json/RemoveSensor/"+auth_token+"?sensorID="+sensor_id;
        }else{
           URI = "http://40.86.214.108/json/RemoveSensor/"+auth_token+"?sensorID="+sensor_id;
        }
      log(URI);
        imonitResult = getImmonitResponse(URI);        
        if(imonitResult == "Success"){
            var sensorList =  getSensorsList(gateway_id);  
            var str_sensor_id = sensor_id.toString();
            var sensorList_2 = [];
            sensorList.forEach(function(t){
                if(str_sensor_id != t){
                    sensorList_2.push(t);
                }
            });            
          
            var updateRes = updateSensorsList(gateway_id,sensorList_2);
            if(updateRes == "success"){
              var remove_sensor = ClearBlade.Query({collectionName: Sensors});
                  remove_sensor.equalTo('sensor_id', sensor_id);
                  remove_sensor.remove(function (err, data) {
                      if (err) {
                        response.error("Sensors table removal error : " + JSON.stringify(data));
                      } else {
                       // response.success(data);
                       log(JSON.stringify(data));
                       response.success("Success");
                      }
                  });
            }
        }else{
          response.success(imonitResult);
        }
      }
      else if(method == "insert"){
        var newSensor = {"sensor_id": sensor_id};
        var checkDigit = reqObj.checkDigit;
        if(gateway_id == 913201){
        URI = "https://www.imonnit.com/json/AssignSensor/"+auth_token+"?networkID="+network_id+"&sensorID="+sensor_id+"&checkDigit="+checkDigit;
        }else{
          URI = "http://40.86.214.108/json/AssignSensor/"+auth_token+"?networkID="+network_id+"&sensorID="+sensor_id+"&checkDigit="+checkDigit;
        }
        log("im URL:"+URI);
        imonitResult = getImmonitResponse(URI);  
        if(imonitResult == "Success"){
          var sensorList =  getSensorsList(gateway_id);
          sensorList.push(sensor_id);
          var updateRes = updateSensorsList(gateway_id,sensorList);
          if(updateRes == "success"){
            var insert_sensor = ClearBlade.Collection({collectionName: Sensors});
              var query = ClearBlade.Query();
                query.equalTo("sensor_id", sensor_id);
                insert_sensor.fetch(query, function (err, data) {
                  if (err) {
                    response.error("Sensors table Insertion error : " + JSON.stringify(data));
                  } 
                  else {
                    if(data.TOTAL > 0){
                      msg.Message = "Duplicate Sensor ID";
                      response.success(JSON.stringify(msg));
                    }
                    else{
                      insert_sensor.create(newSensor, function (err, data) {
                          if (err) {
                            response.error("Sensors Table Insertion ERROR : " + JSON.stringify(data));
                          } else {
                            //response.success(data);
                            response.success("Success");
                          }
                      });
                    }
                  }
              });              
          }           
        }else{
          response.success(imonitResult);
        }
      }
  }
  else{
    msg.Message = "Invalid parameters";
    response.success(JSON.stringify(msg));
  }
  
}

/**
 * @typedef getImmonitResponse
 * Call Imonnit Service to Execute URI
 * @param {string}  URI - To call Imonnit service
 * @returns {string} - service result "success" or "failed"
 * 
 */
function getImmonitResponse(URI){
  var res;
  var requestObject = Requests();
  var response="failed" ;
    var options = {
        uri:URI
    }
    requestObject.get(options,function(err, data){
        if(err){
            response.error("Error " + JSON.stringify(err))
        }
        else{
          log("im result:"+ (JSON.parse(data)).Result);
          response = (JSON.parse(data)).Result;
        }                    
    });
  return response;
  // res = "success";
  // return res;
}

/**
 * @typedef getSensorsList
 * get sensors list from devices_metadata table
 * @param {number}  gateway_id - Gateway id
 * @returns {array} - sensors List
 * 
 */
function getSensorsList(gateway_id){
  var sensorList=[];
  var devices_metadata_query = ClearBlade.Query({collectionName:devices_metadata});
    devices_metadata_query.equalTo("gateway_id", gateway_id);
    devices_metadata_query.fetch(function (err, data) {
        if (err) {
          response.error("ERROR in getSensorsData() : " + JSON.stringify(data));
        } else {
               var sensors = JSON.parse(data.DATA[0].sensors);  
               sensorList =  sensors.sensorsList;
              //  log("sensors "+JSON.stringify(sensors));
        }
    });    
    return sensorList;
}

/**
 * @typedef updateSensorsList
 * update devices_metadata table sensors column
 * @param {number}  gateway_id - Gateway id
 * @param {Array}  sensorList - sensors List
 * @returns {string} - "success" or ERROR
 * 
 */
function updateSensorsList(gateway_id,sensorList){
  var sensors ={};
  var res ;
  // log("sensorList " + sensorList);
  sensors["sensorsList"] = sensorList;
  // log("sensors "+ JSON.stringify(sensors));
  var query = ClearBlade.Query({collectionName: devices_metadata});
    query.equalTo("gateway_id", gateway_id);
    var changes = {
        sensors: JSON.stringify(sensors)
    };    
    query.update(changes, function (err, data) {
        if (err) {
        	response.error("update error : " + JSON.stringify(data));
        } else {
        	res= "success";
        }
    });
    return res;
}
/**
 * @typedef getImAuthKey
 * get authentication token of user
 * @param {number}  userName - User Name
 * @param {number}  password - Password
 * @returns {string} - Authentication token
 * 
 */
function getImAuthKey(userName,password){
  var authKey=0;
  var codeEngine = ClearBlade.Code();
    var serviceToCall = "getImAuthKey";
    var loggingEnabled = true;
    var params = {
      "username": userName,
      "password":password
      };
    codeEngine.execute(serviceToCall, params, loggingEnabled, function(err, result){
    if(err){
    response.error("getImAuthKey() ERROR : " + JSON.stringify(result))
    }else{
      authKey=JSON.parse(result).results; 
    }
    });
    log("authentication key: "+authKey);
    return authKey;
}

var user_id;
//TODO: async problems, use promises when making array of async requests
/**
*  @typedef SensorList
*  get each gateway sensors latest data  which are accessed by user.
*  @param {string} req.params.networkUUID - Network UUID.
*  @param {object} req - request object.It contains networkUUID parameter.
*  @param {object} resp - response object.
*  @returns -- Each Gateway sensors latest data which are accessed by user.
 **/
function SensorList(req, resp) {
     // log(JSON.stringify(req));
  ClearBlade.init({request:req});
  var networkUUID = req.params.networkUUID;
  var sendData={};
  user_id=req.userEmail;

  var query = ClearBlade.Query({collectionName: devices_metadata});
      query.equalTo("network_uuid",networkUUID);
      query.fetch(function(err,data){        
        if(err){
              resp.error("ERROR "+JSON.stringify(data));
        }else{
            // resp.success("DATA "+JSON.stringify( data.DATA[1]));
            var gateways =[];
            sendData.Method ="SensorList";
            (data.DATA).forEach(function(t){
                  var result_data ;
                   var customers_json  = stringToJSONConveter(t.customer_name);
                   var users = customers_json.users;
                   var cus_check = users.indexOf(user_id);
                   if(cus_check > -1){
                        result_data= buildData(t);
                        gateways.push(result_data);
                   }  
            });

            sendData.Result = gateways;
            //   log("Sensor List " + sensorList );
            resp.success(sendData);        }
      });
}
/**
*  @typedef buildData
*  get gateways data
*  @param {object} data - Data fetch from 'devices_metadata' table
*  @returns -- Gateways Data
 **/
function buildData(data){
      var gatewayJson ={};
            var sensor={};
            var sensorList;  
            var sensorData = []; 
//calling gateway List to get Gateways
      var codeEngine = ClearBlade.Code();
      var serviceToCall = "GatewayList";
      var loggingEnabled = true;
      var params = {
            "networkUUID": data.network_uuid,
            "gatewayID":data.gateway_id
            };
           var servc_res = serviceCall(serviceToCall, params, loggingEnabled,codeEngine);
           gatewayJsonObj=stringToJSONConveter(servc_res).results.Result[0];

      //TODO: Given the service call is named `GatewayList`, is there an assumption there's only one gateway?
      // log(data);
      gatewayJson.NetworkID = data.network_id;
      gatewayJson.NetworkUUID = data.network_uuid;
      gatewayJson.GatewayID = data.gateway_id;
      // gatewayJson.sensors = data.sensors;
      gatewayJson.GatewayName = gatewayJsonObj.GatewayName;
      gatewayJson.GatewayType = gatewayJsonObj.GatewayType;
      //Sensor Data Building
      sensor = stringToJSONConveter(data.sensors);
      sensorList = sensor.sensorsList;                  
      // log("SensorList " + sensorList);
      for(var j in sensorList){
            var sensorJson = {};
            var sensors_data_query = ClearBlade.Query({collectionName: sensors_data});
                  sensors_data_query.equalTo("sensor_id",sensorList[j]);
                  sensors_data_query.descending("reading_time");
                  sensors_data_query.setPage(1, 1);
                  processQuery(sensors_data_query).then(function (data) {                         
                        // sensorJson.SensorName = data.DATA[0].sensor_name;
                        var sensor_id = data.DATA[0].sensor_id;
				//sensorJson = buildsensorData(sensor_id); // get sensors type,name
                        buildsensorDataByID(sensor_id).then(function (sensorJson) {
                        //sensorJson.SensorType = data.DATA[0].
                        //sensorJson.SensorCategory = data.DATA[0].
                              sensorJson.CurrentReading = data.DATA[0].sensor_reading;
                              sensorJson.LastCommunicationDate = data.DATA[0].reading_time;
                              sensorJson.BatteryLevel = data.DATA[0].battery_level;
                              sensorJson.SignalStrength = data.DATA[0].signal_strength;
                              sensorData[j] = sensorJson;
                        }, function (reason) {
                              resp.error("promise failed because: "+reason);
                        }); 

                  }, function (reason) {
                        resp.error("promise failed because: "+reason);
                  });
                 
      }
      gatewayJson.Sensors = sensorData;
      return gatewayJson;
            
}


/**
 * @type{object} sendData - Global result object
 * @type{object} response    - Global response object
 * @type{string} _resp 		 - Global response string
 */
var sendData={};
var response;
var reqObj= {};
/**
 * 	@typedef getSensorsData
 *  get Sensors data 
 *  @param {object} req - request object.It contains networkUUID,gatewayID,sensorID,fromTS,toTS parameters.
 *  @param {object} resp - response object.
 *  @param {string} networkUUID - Network UUID.
 *  @param {number} gatewayID - Gateway Id.
 *  @param {number} sensorID -  Sensor Id.
 *  @param {number} fromTS - Staring timestamp to get sensors data from 'sensors_data' table.
 *  @param {number} toTS  - End timestamp to get sensors data from 'sensors_data' table.
 * 
 *  @returns {object} ------
 * 	valid input params : ----
 *  1) networkUUID     		-- It returns all gateways data in network along with latest sensor data
 *  2) networkUUID,fromTS,toTS   -- It returns all gateways data in network along with sensor data between from and to timestamps
 *  3) networkUUID,gatewayID  --- It returns gateway data in network along with latest sensor data
 * 	4) networkUUID,gatewayID,fromTS,toTS  -- It returns gateway data in network along with sensor data between from and to timestamps
 * 	5) networkUUID,gatewayID,sensorID -- It returns sensor latest data 
 *  6) networkUUID,gatewayID,sensorID,fromTS,toTS --- It returns sensor data between from and to timestamps
 *	
 **/
function getSensorsData(req, resp) {
	try{
	// log("Request Object:"+ JSON.stringify(req));
		ClearBlade.init({request:req});
		response = resp;
		reqObj=req.params;
		if(reqObj.hasOwnProperty("networkUUID") ){
			getData();
		}
		else{		
			sendData.message = "Invalid parameters 'Network UUID' missed ";	
			//TODO Need to know the reason why response.error()	is not being used
			response.error(sendData);			
		}
	}
	catch(error){
		response.error("ERROR in getSensorsData() "+ error);
	}
}

/**
 * 	@typedef getData
 *  @params -- it use global variables
 *	@returns {object} -- gateways data
 **/
function getData(){
	try{
		var nuuid = reqObj.networkUUID
		var query = ClearBlade.Query({collectionName:devices_metadata});
			query.equalTo("network_uuid",nuuid);
			if(reqObj.hasOwnProperty("gatewayID")){
				query.equalTo("gateway_id",reqObj.gatewayID);
			}
			query.fetch(function(err,data){        
				if(err){
					response.error("ERROR 2 "+JSON.stringify(data));
				}else{
					 //log("Query DATA  "+JSON.stringify( data));

					var gateways =[];

					sendData.Method ="getSensorsData";
					for(var i=0; i< data.TOTAL ; i++){
						var gatewayJson ={};
						var sensor={};
						var sensorList=[];  
						var sensorData = {}; 
						log("Gateway Id : "+data.DATA[i].gateway_id);
						gatewayJson.Gateway_ID = data.DATA[i].gateway_id;
						gatewayJson.Gateway_Type = data.DATA[i].gateway_type;
						//Sensor Data Building
						sensor = JSON.parse(data.DATA[i].sensors);
						sensorList = sensor.sensorsList;                  
						//  log("SensorList " + sensorList);

						if(reqObj.hasOwnProperty("sensorID")){
							var sensorJson = {};
							if(reqObj.hasOwnProperty("gatewayID")){		
								var sensorID = reqObj.sensorID;
								var sensor_key = "sensor_"+sensorID;
								var check = sensorList.indexOf(sensorID.toString());
								//log("check-----> "+ check + " sensor "+ sensorID);
								if(check > -1){
									sensorJson = getSensorsDataByID(sensorID); //Get sensor data
									if(sensorJson.TOTAL > 0){
										sensorData[sensor_key] = buildsensorData(sensorJson);										
									}
									else{
										continue;
									}
										
								}
								else{
									sensorJson.message = "Invalid sensor id ";		
									response.success(sensorJson);			
								}
							}
							else{
									sensorJson.message = "Invalid parameters 'Gateway Id' missed ";		
									response.success(sensorJson);			
							}
						}
						else{
							for(var j in sensorList){
								// log("gateway block sensor id "+ sensorList[j]);
								var sensorJson = {};
								sensorJson = getSensorsDataByID(sensorList[j]);	//Get sensor data
								log("Data "+ JSON.stringify(sensorJson));
								if(sensorJson.TOTAL > 0 ){
									var sensorID = sensorJson.DATA[0].sensor_id; 
									var sensor_key = "sensor_"+sensorID;
								// sensorData[sensor_key] = mul_sensorData;		
				  				sensorData[sensor_key] = buildsensorData(sensorJson);	
								}
								else{
									continue;
								}
									
							}
						}					
						gatewayJson.DATA = sensorData;
						gateways[i]=gatewayJson;
						
					}
					sendData.Result = gateways;       
				}
			});
		response.success(sendData);
	}
	catch(error){
		response.error("ERROR in getData() "+ error);
	}
}

/**
 * 	@typedef getSensorsDataByID
 *  get data from sensors_data table based on sensor_id
 *  @params {string} sensor_id -- sensor_id
 *	@returns {object} -- returns sensors data  from 'sensors_data' table
 **/
function getSensorsDataByID(sensorId){
	try{
	
		var sensorJson = {};
		var retObj = {};
		var query2 = ClearBlade.Query({collectionName: sensors_data});
			query2.equalTo("sensor_id",sensorId);
				if(reqObj.hasOwnProperty("fromTS") && reqObj.hasOwnProperty("toTS")){
					query2.greaterThan("reading_time",reqObj.fromTS);
					query2.lessThan("reading_time",reqObj.toTS);
				}
				else{
					query2.descending("reading_time");
					query2.setPage(1, 1);
				}  
			query2.fetch(function(err,data){
				if(err){
					response.error("ERROR in fetching Sensor data"+JSON.stringify(data));
				}
				else{
							retObj = data;                        
				}
			});
        return retObj;
	}
	catch(error){
		response.error("ERROR in getSensorsDataByID() "+ error);
	}
}

/**
 * 	@typedef buildsensorData
 *  get sensors name,type  from 'Sensors' table and merge it into Sensors Json
 *  @params {object} sensorJson -- sensor json which get are taken from 'sensors_data' table
 *	@returns {Array} -- returns sensors data array  
  **/
function buildsensorData(sensorJson){
	try{
	//   log("build sensor data block");
      var mul_sensorData=[];
      var sensorName = "";
      var sensorType = "";
      var sensor_id = sensorJson.DATA[0].sensor_id; 
      var sensors_query = ClearBlade.Query({collectionName: Sensors });
		      sensors_query.equalTo("sensor_id",sensor_id);
          		sensors_query.fetch(function(err,result){
              if(err){
                response.error("Sersor Data fetching ERROR "+ JSON.stringify(result));
              }
              else{
                sensorName = result.DATA[0].sensor_name;
                sensorType = result.DATA[0].sensor_type;
                // log("SEnsors  Data "+ JSON.stringify(result) +"sensorName" +sensorName);
              }
          });

      	sensorJson.DATA.forEach(function(data){
        data.sensor_name = sensorName;
        data.sensor_type = sensorType;
        mul_sensorData.push(data);
      });      
      return mul_sensorData;
	}
	catch(error) {
		response.error("Error in buildsensorData() "+ error);
	}
}
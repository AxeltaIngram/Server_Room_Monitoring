/**
 * @type{string} networkUUID - Network UUID 
 * @type{object} finalResult - Return result object
 * @type{object} sendData    - Global object
 * @type{string} _resp 		 - Global response string
 */

var networkUUID;
var finalResult={};
var sendData={};
var _resp;
var cb;
//TODO: use utility helpers, do not use methods with code exits directly in for loops
// try using q-promise-library, array of promises and use q.all()

/**
 *  @typedef getNetWorkData
 *  TODO : getnetwork data function 
 *  @param {object} req - request object.It contains networkUUID parameter.
 *  @param {object} resp - response object.
 *  @param {string} networkUUID - Network UUID.
 *  @returns {object} - return network data including gateways and sensors 
 **/
function getNetWorkData(req, resp) {
	try{		
		_resp=resp;
		ClearBlade.init({request:req});
		cb=ClearBlade;
		var reqObj=req.params;
		// checking networkUUID is in params object or not. if we are not passed networkUUID fetch it from 'devices_metadata' table
		if(! reqObj.hasOwnProperty("networkUUID"))
		{
			var nwquery = ClearBlade.Query({collectionName:devices_metadata});
			nwquery.columns(["network_uuid"]);
			nwquery.fetch(function(err,data){        
			if(err){
				_resp.error("ERROR 1"+stringToJSONConveter(data));
			}else{
				var networksArray=[];
				data.DATA.forEach(function(t){
					if(networksArray.indexOf(t.network_uuid)<0){
						networksArray.push(t.network_uuid);
					}
				});
				finalGwAry=[];
				finalResult["Method"]="NetWorkData";

				networksArray.forEach(function(nvalue){
					networkDetails(nvalue); // calling networkDetails() to get data
					finalGwAry=finalGwAry.concat(sendData.Result);
				});
				finalResult["Result"]=finalGwAry; 
				_resp.success(finalResult);
			}
			}); 
		}else{
			networkUUID = req.params.networkUUID;
			networkDetails(networkUUID); // calling networkDetails() to get data
			_resp.success(sendData);
		}
	}
	catch(error){
		_resp.error("ERROR in getNetWorkData() "+ error);
	}
}

/**
 * 	@typedef networkDetails
 *  code to get single network details
 *  @param {string} nuuid - User Name.
 *	@returns {object} - returns network data
 **/
function networkDetails(nuuid){  
	try{
		
		var query = ClearBlade.Query({collectionName:devices_metadata});
			query.equalTo("network_uuid",nuuid);
			query.fetch(function(err,data){        
				if(err){
					_resp.error("ERROR 2 "+stringToJSONConveter(data));
				}else{
					// resp.success("DATA "+stringToJSONConveter( data.DATA[1]));
					var gateways =[];
					sendData.Method ="NetWorkData";
					for(var i=0; i< data.TOTAL ; i++){
						   var gatewayJson ={};
						   var sensor={};
						   var sensorList;  
						   var sensorData = []; 

						   
					var codeEngine = ClearBlade.Code();
					var serviceToCall = GatewaysGroup;
					var loggingEnabled = false;
					var params = {
						"networkUUID": data.DATA[i].network_uuid,
						"gatewayID":data.DATA[i].gateway_id
						};
                          var serviceRes=serviceCall(serviceToCall, params, loggingEnabled,codeEngine);
				        serviceRes=stringToJSONConveter(serviceRes);
						 if(serviceRes.success){
							gatewayJson=serviceRes.results.Result[0]; 
						 }
					// codeEngine.execute(serviceToCall, params, loggingEnabled, function(err, glistData){
					// if(err){
					// _resp.error("Failed to complete my service: " + stringToJSONConveter(glistData))
					// }else{
					//  gatewayJson=JSON.parse(glistData).results.Result[0];
					  
					// }
					// });
						
					if( gatewayJson !== undefined ){
// log("Data --> "+stringToJSONConveter(data));

					//       //Sensor Data Building
					sensor = stringToJSONConveter(data.DATA[i].sensors);
					sensorList = sensor.sensorsList;                  
					// log("SensorList " + sensorList);
						for(var j in sensorList){
							// log("sensor -- "+ sensorList[j]);
							var sensorJson = {};
							// fetch data from 'sensors_data' table
							var query2 = ClearBlade.Query({collectionName:sensors_data});
								  query2.equalTo("sensor_id",sensorList[j]);
								  query2.descending("reading_time");
								  query2.setPage(1, 1);
								  processQuery(query2)
								  .then(function(promiseRes){
                                      var sen_data=promiseRes;

									  // sensorJson.SensorName = sen_data.DATA[0].sensor_name;
										//sensorJson = buildsensorData(sensorList[j]);
										buildsensorDataByID(sensorList[j])
										.then(function(result){
                                          sensorJson=result;
										  if(!sen_data.TOTAL)
										{
                                        sensorJson.SensorID =sensorList[j];
										//sensorJson.SensorName="";
										//sensorJson.SensorType="";
										sensorJson.CurrentReading ="";
										sensorJson.LastCommunicationDate ="";
										sensorJson.BatteryLevel = "";
										sensorJson.SignalStrength = "";	
										}else{
											
										//sensorJson.SensorType = sen_data.DATA[0].
										//sensorJson.SensorCategory = sen_data.DATA[0].
										sensorJson.SensorID =sen_data.DATA[0].sensor_id;
										sensorJson.CurrentReading = sen_data.DATA[0].sensor_reading;
										sensorJson.LastCommunicationDate = sen_data.DATA[0].reading_time;
										sensorJson.BatteryLevel = sen_data.DATA[0].battery_level;
										sensorJson.SignalStrength = sen_data.DATA[0].signal_strength;	
										}
										sensorData[j] = sensorJson;
										},function(reason){
                                            _resp.error("Error:"+reason);
										}
										);
								  },function(prReason)
								  {
                                 _resp.error("ERROR in fetching Sensor data"+JSON.stringify(prReason));
								  }
								  );
							// 	  query2.fetch(function(err,sen_data){
							// 	  if(err){
							// 			_resp.error("ERROR in fetching Sensor data"+stringToJSONConveter(data));
							// 	  }
							// 	  else{								
							// 			// sensorJson.SensorName = sen_data.DATA[0].sensor_name;
							// 			//sensorJson = buildsensorData(sensorList[j]);
							// 			buildsensorDataByID(sensorList[j])
							// 			.then(function(result){
                            //               sensorJson=result;
							// 			  if(!sen_data.TOTAL)
							// 			{
                            //             sensorJson.SensorID =sensorList[j];
							// 			//sensorJson.SensorName="";
							// 			//sensorJson.SensorType="";
							// 			sensorJson.CurrentReading ="";
							// 			sensorJson.LastCommunicationDate ="";
							// 			sensorJson.BatteryLevel = "";
							// 			sensorJson.SignalStrength = "";	
							// 			}else{
											
							// 			//sensorJson.SensorType = sen_data.DATA[0].
							// 			//sensorJson.SensorCategory = sen_data.DATA[0].
							// 			sensorJson.SensorID =sen_data.DATA[0].sensor_id;
							// 			sensorJson.CurrentReading = sen_data.DATA[0].sensor_reading;
							// 			sensorJson.LastCommunicationDate = sen_data.DATA[0].reading_time;
							// 			sensorJson.BatteryLevel = sen_data.DATA[0].battery_level;
							// 			sensorJson.SignalStrength = sen_data.DATA[0].signal_strength;	
							// 			}
							// 			},function(reason){
                            //                 _resp.error("Error:"+reason);
							// 			}
							// 			);
							// 	  }
							// });
							// log("sensor data  "+stringToJSONConveter(sensorJson));
							//sensorData[j] = sensorJson;
						}
						gatewayJson.Sensors = sensorData;
						}
						else{
							continue;
						}
						gateways[i]=gatewayJson;
					}
					sendData.Result = gateways;       
				}
			});
	}
	catch(error){
		_resp.error("ERROR in networkDetails() "+ error);
	}
}

/**
 * 	@typedef DBConnector
 *  get sensor data and append to passed object 
 *  @param {number} sensorJson - sensor_id.
 *  @returns {object} - returns the json object it contains sensor_type and sensor_name
 **/
function buildsensorData(sensor_id){
	try{
	//   log("build sensor data block");
      var sensorData={};
      var sensorName = "";
      var sensorType = "";
	 // fetch data from 'Sensors' table 
      var sensors_query = ClearBlade.Query({collectionName:Sensors});
		      sensors_query.equalTo("sensor_id",sensor_id);
          sensors_query.fetch(function(err,result){
              if(err){
                _resp.error("Sersor Data fetching ERROR "+ stringToJSONConveter(result));
              }
              else{
                sensorData.SensorName = result.DATA[0].sensor_name;
                sensorData.SensorType = result.DATA[0].sensor_type;				
                // log("SEnsors  Data "+ stringToJSONConveter(result) +"sensorName" +sensorName);
              }
          });	
     //TODO async error will return before callbacks returns
      return sensorData;
	}
	catch(error) {
		_resp.error("Error in buildsensorData() "+ error);
	}
}

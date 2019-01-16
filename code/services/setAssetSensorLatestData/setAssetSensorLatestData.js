var reslt_json = {};
function setAssetSensorLatestData(req, resp) {
  
  ClearBlade.init({request: req});
    var imonnitData = typeof req.params.body == 'string' ? JSON.parse(req.params.body) : req.params.body;
    var sensorMsg = imonnitData.sensor_message;
    var sensor_id = sensorMsg.sensorID;
     var the_value = sensorMsg.dataValue;
     sensorValue(the_value);  
         reslt_json.latestData = sensorMsg;
    var labelQuery=ClearBlade.Query({collectionName:"Sensors"});
        labelQuery.equalTo("sensor_id",sensor_id);
        labelQuery.columns(["sensor_id", "sensor_label"]);
        labelQuery.fetch(function(err,data){
          if(err){
            resp.error("the error at getlabel is :" +stringToJSONConverter(data));
          }else{
         var the_data = data.DATA;
            reslt_json.label = data.DATA[0].sensor_label;
            log(JSON.stringify(reslt_json));
             resp.success(reslt_json);
          }
        }); 
}
function sensorValue(the_value){
  if(the_value.includes("|")){
 var split_value = the_value.split("|");
   reslt_json.value = split_value[0];
     
  }else{
      reslt_json.value = the_value;
  }

}

function TestService(req, resp) {
  var final_data = {"method":"getAlertsDetails" };
  var temp_data = [];
  var i=0;
  ClearBlade.init({request:req});   
  var alrt_config_id;
  if(req.params.hasOwnProperty("item_id")){
    alrt_config_id = req.params.item_id;
  }
    getAlertConfigDataByID(alrt_config_id).then(function(config_data){
      var alrt_config_data = stringToJSONConveter(config_data);
      var TOTAL = alrt_config_data.TOTAL;
      if(TOTAL > 0){
        buildAlertData(alrt_config_data).then(function(DATA){
            final_data.DATA = DATA;
            resp.success(final_data);
        });
        
      }
      else{
        final_data.message = "No Data";
        resp.error(final_data);
      }     
    }
    ,function (reason) {
      resp.error(reason); 
    });
}

/**
 *  @typedef getAlertConfigDataByID
 *  TODO: get alert configuration row based on item_id 
 *  @param {string} item_id
 *  @returns {object} deferred object 
 **/
function getAlertConfigDataByID(item_id){
  var deferred = Q.defer();
  var alert_config_query = ClearBlade.Query({collectionName: "AlertConfigurations"});
        if(typeof item_id !== "undefined"){
          alert_config_query.equalTo("item_id",item_id);
        }
        processQuery(alert_config_query).then(function (alert_config_data) { 
          deferred.resolve(alert_config_data); 
        }
        ,function (reason) {
              deferred.reject(reason); 
        });
        
  return  deferred.promise;
}
/**
 *  @typedef getAlertByConfigID
 *  TODO: get all alerts based on configuration_id and customer_id
 *  @param {string} config_id
 *  @returns {object} deferred object 
 **/
function getAlertByConfigID(config_id,customer_id){
  var deferred = Q.defer();
  log("customer_id  "+customer_id);
  log("config id "+ config_id);
  var alerts_query = ClearBlade.Query({collectionName: "Alerts"});
      if((typeof config_id == 'undefined') && (typeof customer_id == 'undefined')){
        var retObj = {"TOTAL":0};
        deferred.resolve(retObj);
      }
      else{
        if(typeof config_id !== "undefined"){
          alerts_query.equalTo("configuration_id",config_id);          
        }
        if(typeof customer_id !== "undefined"){
          alerts_query.equalTo("customer_id",customer_id);         
        }
        processQuery(alerts_query).then(function (alerts_data) { 
          deferred.resolve(alerts_data); 
        }
        ,function (reason) {
              deferred.reject(reason); 
        });
      }
        
  return  deferred.promise;
}

function buildAlertData(alrt_config_data){
  var deferred = Q.defer();
    var AlertDATA = [];
        alrt_config_data.DATA.forEach(function(config_data){
          alrt_config_id = config_data.item_id;
          var customer_id = config_data.customer_id;
            getAlertByConfigID(alrt_config_id,customer_id).then(function(alert_data){
              alert_data = stringToJSONConveter(alert_data);
              if(alert_data.TOTAL > 0){
                alert_data.DATA.forEach(function(alert_row){
                  var DataJSON ={};
                  DataJSON.name = config_data.name;
                  DataJSON.users = stringToJSONConveter(config_data.contacts);
                  DataJSON.is_active = alert_row.is_active;
                  DataJSON.sent_date = alert_row.sent_date;
                  DataJSON.acknowledge_date = alert_row.acknowledge_date;
                  AlertDATA.push(DataJSON);
                });
              }
              else{
                  var DataJSON ={};
                  DataJSON.name = config_data.name;
                  DataJSON.users = stringToJSONConveter(config_data.contacts);
                  AlertDATA.push(DataJSON);
              }
              log("AlertDATA  >> "+JSON.stringify(AlertDATA));
              deferred.resolve(AlertDATA); 
            }
            ,function (reason) {
              resp.error(reason); 
            });   
        });
  
    return  deferred.promise;  
}
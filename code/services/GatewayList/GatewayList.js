/**
 *  @type{string}  _resp  - global Response varible
 *  @type{string} _req    - global Request variable
 *  @type{Array} gatewaysList    - It contains total gateway list
 *  @type{number} user_id    - user id get from request object.
 */
 
var _resp,_req;
var gatewaysList=[];
var user_id;

//TODO: Add checks before using any object's children and using logging if errors are tolerable
//TODO: Making async calls in for loop, resort to using promises, q.all see q-promise-library
/**
 *  @typedef GatewayList
 *  get the Gateways data which are accessed by user.
 *  @param {string} networkUUID - send Network UUID.
 *  @param {object} req - request object.It contains networkUUID.
 *  @param {object} resp - response object.
 *  @returns {Object} All Gateways data which are accessed by user.
 **/
function GatewayList(req, resp) {
  try{
  if(req.hasOwnProperty("userEmail"))
  {
  user_id=req.userEmail;
  }
  log("User Email:"+user_id);
  _resp=resp;
  _req=req;

   ClearBlade.init({request:req});
   if(req.params.hasOwnProperty("networkUUID"))
    {
   var networkuuid = req.params.networkUUID;
    }

   var finalObj={
     "Method":"GatewayList",
     "Result":gatewaysList
     };

     var gListQuery=ClearBlade.Query({"collectionName":devices_metadata});
     gListQuery.equalTo("network_uuid",networkuuid);
     //TODO is this supposed to be a param as well? 
     if(req.params.hasOwnProperty("gatewayID")){
       gListQuery.equalTo("gateway_id",req.params.gatewayID);
     }
     // calling networkGateways() to get gateways data 
     // gListQuery.fetch(networkGateways);
      processQuery(gListQuery)
       .then(function (value) {
              gatewaysList= groupOfGatewaysinNetwork(value,user_id);
              log("Gateways response Object:"+JSON.stringify(gatewaysList));
              finalObj.Result=gatewaysList;
             // resp.success(finalObj);
            }, function (reason) {
                resp.error("promise failed because: "+reason);
            }
        );
 resp.success(finalObj);
  }catch(error){
    resp.error("Error: "+error);
  }
}


//TODO Prefer using helper methods, use try catch for methods throwing exceptions
/**
 * @callback requestCallback
 *  @typedef networkGateways
 *  fetch and returns the gateways data
 *  @param {string} err - ERROR message
 *  @param {string} qresult - Query 
 *  @returns {Object} - Gateways Data
 **/
// function networkGateways(err,qresult)
// {
// if(err){
//  _resp.error("ERROR "+JSON.stringify(qresult));
// }else{
//   var glist=qresult.DATA;
//   glist.forEach(function(gObj){
//           var gatewayObject={};
//           var assoSensors=JSON.parse(gObj.sensors).sensorsList;
//           log(assoSensors);
//           // log("customers "+gObj.customer_name);
//           var customers = gObj.customer_name;
//           var user_check = customers.indexOf(user_id); //To check gateway is assigned to user or not 
//          //  log("Check --- "+ user_check +"Gateway_ID:"+gObj.gateway_id);
//           if(user_check > -1){
//             //Fetching datafrom gateways_data Table
//             var gdetailsQuery=ClearBlade.Query({"collectionName":gateways_data});
//               gdetailsQuery.equalTo("gateway_id",gObj.gateway_id);
//               gdetailsQuery.descending("reading_date");
//               gdetailsQuery.fetch(function(err,gdetails){
//                 if(err){
//                   _resp.error("ERROR "+JSON.stringify(qresult));
//                 }else{
//                   if(gdetails.TOTAL===0){
//                   //gatewayObject["GatewayName"]="";
//                   gatewayObject["BatteryLevel"]="";
//                   gatewayObject["SignalStrength"]="";
//                   gatewayObject["LastCommunicationDate"]="";
//                   }else{
//                  // gatewayObject["GatewayName"]=gdetails.DATA[0].gateway_name;
//                   gatewayObject["BatteryLevel"]=gdetails.DATA[0].battery_level;
//                   gatewayObject["SignalStrength"]=gdetails.DATA[0].signal_strength;
//                   gatewayObject["LastCommunicationDate"]=(new Date(gdetails.DATA[0].reading_date)).getTime();
//                   }
//                 gatewayObject["GatewayName"]=gObj.gateway_name;
//                 gatewayObject["NetworkID"]=gObj.network_id;
//                 gatewayObject["NetworkUUID"]=gObj.network_uuid;
//                 gatewayObject["NetworkName"]=gObj.network_name;
              
//                 gatewayObject["GatewayID"]=gObj.gateway_id;
//                 gatewayObject["GatewayType"]=gObj.gateway_type;
//                 gatewayObject["ConfiguredSensors"]=assoSensors.length;
//                 gatewayObject["Heartbeat"]=gObj.gateway_heartbeat;
                
//                 gatewayObject["MAC_Address"]=gObj.mac_address;
                
//                 gatewayObject["ClientName"]=JSON.parse(gObj.customer_name).users;
//                 }
//               });                  
//             gatewaysList.push(gatewayObject);
//         } 
//   });
// //log(gatewaysList);
// }
// }
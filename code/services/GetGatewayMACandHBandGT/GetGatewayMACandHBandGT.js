/**
 * @type{object} cresp - global response object 
 * @type{number} gateway_id - store gatewayID from request object
 * @type{string} user_name - store user_name from request object
 * @type{string} pwd URI - store pwd from request object
 * @type{object} reqObj - store request object
 */
var cresp,gateway_id,user_name,pwd,reqObj;
var auth_key_service="getImAuthKey";

/**
 * @typedef GetGatewayMACandHBandGT
 * TODO: To get gateway MAC address,HeartBeat and gatewayType from imonnit
 * @param {object} req - request object
 * @parm {object} resp - response object
 */
function GetGatewayMACandHBandGT(req, resp) {
  ClearBlade.init({request:req});
  cresp=resp;
  reqObj=req.params;
  
  if(reqObj.hasOwnProperty("gateway_id")&&reqObj.hasOwnProperty("username")&&reqObj.hasOwnProperty("password"))
  {
   
  gateway_id=reqObj.gateway_id;
  user_name=reqObj.username;
  pwd=reqObj.password;

  var serviceObj={
    "username":user_name,
    "password":pwd
  };
  ClearBlade.Code().execute(auth_key_service,serviceObj,false,authKey);
  }else{
  resp.success('Request Object should contain gatewayID,userName,password');
  }
}


/**
 * @callback authKey
 * TODO: invoke GetGateway API of imonnit and returns gateway details object
 * @param {object} err - error object
 * @parm {object} authres - response from getAuthKey service
 */
function authKey(err,authres)
{
  if(err)
  {
    log(err);
 cresp.error(err);
  }else{
 var rAuthKey=JSON.parse(authres).results;
 log(rAuthKey);
  var requestObject = Requests();
  if(gateway_id === 913201)
  {
    var URI = "https://www.imonnit.com/JSON/GatewayGet/"+rAuthKey+"?gatewayID="+gateway_id;
  }else{
   var URI = "http://40.86.214.108/JSON/GatewayGet/"+rAuthKey+"?gatewayID="+gateway_id;
  }  
       log(URI);
        var options = {
            uri:URI
        }
         requestObject.get(options,function(err,resObj){
           if(err){
            cresp.error("Error " + JSON.stringify(err))
        }
        else{
            var result_data  = JSON.parse(resObj);
            cresp.success(result_data.Result);
        }
         });
  }
}

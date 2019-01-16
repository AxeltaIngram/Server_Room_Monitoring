
 /**
  * @type{object} _resp -  responseMessage
  * @type{string} auth_token - imonnit super user auth token
  */ 
var _resp;
//TODO: token in constant library
var auth_token = superUser_auth;
//TODO Using libraries and helper functions would be better, as system scales debugging might become a challenge
//TODO update what in gateway is not obvious until I look at the code, same for reform

/**
 *  @typedef deleteGateway
 *  UPDATE/REFORM/DELETE  Gateway in Imonnit and Clearblade platform
 *  @param {object} req - request object. It contains method,gateway_id,auth_token parameters
 *  @param {string} req.params.method -  update/reform/remove .
 *  @param {number} req.params.gateway_id - Gateway Id.
 *  @param {string} req.params.auth_token - user auth token
 *  @param {object} resp - response object.
 *  @returns {String} returns update/reform/remove  operation status "success (or) ERROR message "
 * 
 */
function deleteGateway(req, resp) {
  _resp = resp;

  var msg = {};
  ClearBlade.init({ request: req });
  var reqObj = req.params;
  if (reqObj.hasOwnProperty("auth_token")) {
    auth_token = reqObj.auth_token;
  }
  if ((reqObj.hasOwnProperty("method")) && (reqObj.hasOwnProperty("gateway_id"))) {
    var dev = ClearBlade.Device();
    var gateway_id = reqObj.gateway_id;
    var imResult;
    var method = reqObj.method;
    var URI = "";
    //TODO: Using functions would be preferable, making a library would be a good idea.
    //  Update Service execution
    if (method === "update") {
      //TODO: prefer using constants and use `===` for checks
      if (gateway_id !== 913201) {
          URI =imonnit_uri2+update_url+auth_token+"?gatewayID="+gateway_id;
      } else {
        URI =imonnit_uri+update_url+auth_token+"?gatewayID="+gateway_id;
      }
      log()
      imResult = immonitResponse(URI);
      // TODO this might exit before getting value in imResult
      resp.success(imResult);
    }
    //  Delete Service execution
    else if (method === "remove") {
      if (gateway_id !== 913201) {
        URI =imonnit_uri2+remove_url+auth_token+"?gatewayID="+gateway_id;
      } else {
        auth_token=ax_auth;
        URI =imonnit_uri+remove_url+auth_token+"?gatewayID="+gateway_id;
      }
      imResult = immonitResponse(URI);
      if (imResult == "Success") {
        var del_query = ClearBlade.Query({ collectionName: devices_metadata });
        del_query.equalTo("gateway_id", gateway_id);
        del_query.remove(function(err, data) {
          if (err) {
            //TODO try-catch for stringify
            resp.error("deletion error : " + stringToJSONConveter(data));
          } else {
            resp.success(imResult);
          }
        });
      } else {
        resp.error(imResult);
      }
    }
    // Reform Service execution
    else if (method === "reform") {
      if (gateway_id !== 913201) {
           URI =imonnit_uri2+reform_url+auth_token+"?gatewayID=" + gateway_id;
      } else {
        URI =imonnit_uri+reform_url+auth_token+"?gatewayID=" + gateway_id;
      }
      imResult = immonitResponse(URI);
      // TODO async error this might exit before getting value in imResult
      resp.success(imResult);
    }
    // If params are miss matched returns message
    else {
      //TODO Need to know why resp.success is being used in case of failure
      msg.Message = "Invalid Method ";
      resp.success(stringToJSONConveter(msg));
    }
  } else {
    msg.Message = "Invalid Method ";
    resp.error(stringToJSONConveter(msg));
  }
}

//TODO this method might return without updating response values, resort to using promises
/**
 * @typedef getImmonitResponse
 * Call Imonnit Service to Execute URI
 * @param {string}  URI - To call Imonnit service
 * @returns {string} - service result
 *
 */
// function getImmonitResponse(URI) {
//   var requestObject = Requests();
//   var response = "failed";
//   var options = {
//     uri: URI
//   };
//   requestObject.get(options, function(err, data) {
//     //TODO try-catch
//     if (err) {
//       _resp.error("Error " + stringToJSONConveter(err));
//     } else {
//       try{
//         log("im service response " + JSON.parse(data).Result);
//         response = JSON.parse(data).Result;    
//       }catch(e){
//         log("JSON.parse ERROR "+e)
//       }   
//     }
//   });
//   //TODO async error
//   return response;
// }

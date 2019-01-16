//TODO apply checks for existance of object keys, use try catch for json parse
// equality checks use `===` instead of using `==` , ensure using resp.success only at places where code exits
/**
 *  @typedef getImAuthKey
 *  get user authentication key from Imonnit 
 *  @param {string} username - User Name.
 *  @param {string} password - Password.
 *  @param {string} auth_token - auth_token. -- optional
 *  @param {string} method -  update/remove. 
 *  @param {number} gateway_id - Gateway Id.
 *  @returns -- if we pass username and password only it returns Authentication token 
 *            -- else it performs  update/remove operation of  passed gateway
 **/
function getImAuthKey(req, resp) {
    ClearBlade.init({request:req});
    var msg={};
    var reqObj = stringToJSONConveter(req.params);
    var username = reqObj.username;
    var password = reqObj.password;
  if((reqObj.hasOwnProperty("username")) && (reqObj.hasOwnProperty("password")) && (reqObj.hasOwnProperty("method")) && (reqObj.hasOwnProperty("gateway_id"))){
    //Excutes Update service
    var requestObject = Requests();
    if(reqObj.gateway_id !== 913201)
          {
    var URI = imonnit_uri2+"/json/GetAuthToken?username="+username+"&password="+password;
          }else{
  var URI = imonnit_uri+"/json/GetAuthToken?username="+username+"&password="+password;
          }
    var options = {
        uri:URI
    }
    requestObject.get(options,function(err, data){
        if(err){
            resp.error("Error " + stringToJSONConveter(err))
        }
        else{
            try{
                var result_data  = stringToJSONConveter(data);
                var auth_token = result_data.Result;
                reqObj.auth_token = auth_token;
                var codeEngine = ClearBlade.Code();
                var serviceToCall = "deleteGateway";
                var loggingEnabled = false;
                var serviceResp;
               // log(reqObj);
               serviceResp=serviceCall(serviceToCall, reqObj, loggingEnabled,codeEngine);
               if(serviceResp.success){
                resp.success(serviceResp);
               }else{
                resp.error(serviceResp);
               }
                // codeEngine.execute(serviceToCall, reqObj, loggingEnabled, function(err, data){
                //     if(err){
                //         resp.error("Failed to complete my service: " + stringToJSONConveter(data))
                //     }else{
                //     log("Service Response:"+data);
                //     serviceResp=data;
                //     }
                // });
               
            }
            catch(e){
                resp.error("Exception in getImAuthKey() "+e);
            }
        }                    
    });

  }
  else{
      //TODO use library instead of calling code services
      //Executes delete service
      if((reqObj.hasOwnProperty("method")) && (reqObj.hasOwnProperty("gateway_id")) )
      {
       // reqObj.auth_token=superUser_auth;
        var resObj;
        resObj=serviceCall(UpdateorRemoveGateway, reqObj, false,ClearBlade.Code());
              if(resObj.success){
                resp.success(resObj);
               }else{
                resp.error(resObj);
               }

        //  ClearBlade.Code().execute(deleteGateway, reqObj, false, function(err, data){
        //         if(err){
        //             resp.error("Failed to complete my service: " + stringToJSONConveter(data))
        //         }else{
        //           log(data);
        //            resObj=data;
        //         }
        //     }); 
        //     resp.success(resObj);
      }
      else if((reqObj.hasOwnProperty("username")) && (reqObj.hasOwnProperty("password"))){
       //To get Imonnit user Authentication key
        var requestObject = Requests();
        if(username !=="Axelta")
        {
     var URI = imonnit_uri2+"/json/GetAuthToken?username="+username+"&password="+password;
        }else{
     var URI = imonnit_uri+"/json/GetAuthToken?username="+username+"&password="+password;
        }
    requestObject.get({uri:URI},function(err, data){
        if(err){
            resp.error("Error " + stringToJSONConveter(err))
        }
        else{
            try{
                 var result_data  = stringToJSONConveter(data);
                 resp.success(result_data.Result);
            }
            catch(e){
                resp.error("Exception in getImAuthKey() "+e);
            }           
        }
        });
      }
      
      else{
          //TODO why error message are in resp.success?
          log("Request:"+JSON.stringify(req));
        msg.Message="Invalid Parameters";
        resp.error(stringToJSONConveter(msg));
      } 
  }
}

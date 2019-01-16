// this code service reads the collection and retrieves a list of sensors
// it would be better to have a simple selection with this but right now the sensors are in a JSON field
var DEVICES = "devices_metadata";

function Portal_LoadDevices(req, resp) {

    ClearBlade.init({request:req});
    
    var query = ClearBlade.Query({ collectionName: DEVICES });
    
    //log (req.params);

    var gateway_id = "904065" ;   // hardcode for the demo gateway
    if ( req.params.gateway_id) {
        gateway_id = req.params.gateway_id ;
    } 

    log ("Gateway Id is: " + gateway_id );

    query.equalTo("gateway_id", gateway_id);
	
    query.fetch(function(err, data) {
        if(err)
            resp.error(data);
        else {
            //log(data.DATA[0]);
            log (JSON.parse(data.DATA[0].sensors)); 
            // {"sensorsList":["385164","351530","385010","385085","385259","385258"]}
            resp.success(data.DATA[0].sensors);
        }
    })  ;
}
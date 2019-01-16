
// this code service reads the collection and retrieves all the readings of a specific sensor
// it would be better if the there was a specific sensor table but there we go
var DEVICES = "sensors_data";

function Portal_LoadSensor(req, resp) {

    ClearBlade.init({request:req});
    
    var query = ClearBlade.Query({ collectionName: DEVICES });
    
    log (req.params);

    var sensor_id = "351530" ; //385259" ;   // hardcode for one sensor for testing
    if ( req.params.sensor_id) {
        sensor_id = req.params.sensor_id ;
    } 

    log ("Sensor Id is: " + sensor_id );

    query.equalTo("sensor_id", sensor_id);
    query.ascending ("reading_time") ;
	
    query.fetch(function(err, data) {
        if(err)
            resp.error(data);
        else {
            //log(data.DATA[0]);
            var sensors = [];
            //log (JSON.parse(data.DATA[0].sensors)); 
            for (i=0; i < data.DATA.length; i++ ) {
                var d = data.DATA[i] ;
                // to make it easy to display line charts in the portal, we need to modify the arrays to the portal a bit ...
                // the problem is the imonnitDeviceData code and collection does not capture the data type so we have to hack this
                if ( isNaN(d.sensor_reading) == false) {   // so it is a number ..  assume it's temperature
                        d.temperature = d.sensor_reading ;
                } else {  // if it is a number,
                    var foo = d.sensor_reading.split('|') ; // 51.78|22.17
                    if ( foo.length == 2) {     // it could be a door, so check for split to work
                        d.humidity = foo[0];
                        d.temperature = foo[1] ;
                    } 
                }
                d.timestamp = d.reading_time ; // copy reading_time to timestamp for portal
                sensors.push(d);
            }
            //resp.success(data.DATA);
            resp.success(sensors) ;
        }
    });
}
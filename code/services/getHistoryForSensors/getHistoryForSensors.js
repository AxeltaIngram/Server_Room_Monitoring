function getHistoryForSensors(req, resp) {
  // var testParams = {
  //   sensor_ids:["351530","385259"],  //required
  //   startTime:"2018-09-14T14:29:30Z",          //optional
  //   endTime:"2018-09-14T18:44:16Z"       //optional
  // };
  //log(req);
  // var testParams = {
  //   "sensor_ids": ["351530", "385010", "385258"],
  //   "startTime": "2018-09-20T18:52:58.971Z",
  //   "endTime": "2018-09-21T18:52:58.971Z"
  // }
  //req.params = testParams;

  ClearBlade.init({request:req});
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
    
  }

  var mergePointsByTimeStamp = function(points) {
    var lastMergedPoint = {};
    for( var j=0; j<attributeNames.length; j++){
      lastMergedPoint[attributeNames[j]]="";
    }

    for (var i=0; i < points.length;i ++) {
      var point = points[i];
      for( var j=0; j<attributeNames.length; j++){
        if (!(attributeNames[j] in point)){
          point[attributeNames[j]]=lastMergedPoint[j];
        }else{
          lastMergedPoint[j]=point[attributeNames[j]];
        }
          
      }
    }
     response.payload = points;
     sendResponse();
  }
  var attributeNames = [];
  var addAttributeName = function(attributeName){
    if (attributeNames.indexOf(attributeName) == -1){
      //attributeName doesnt exist so add it here
      attributeNames.push(attributeName);
    }
  }

  var callback = function (err, data) {
    if (err) {	
      response.err= true;
      response.message = data;
      sendResponse();
    } else {
      // response.payload = data;
      var points = [];
      for (var i=0; i<data.DATA.length;i++){
        var reading = data.DATA[i];
        var point = {};
       // var rtime=new Date(reading.reading_time);
        point.timestamp =reading.reading_time;
        var readingsSplit = reading.sensor_reading.split("|");
        for (var j=0;j<readingsSplit.length;j++){
          
          var attributeName =reading.sensor_id;
          if (readingsSplit.length>1){
            attributeName = reading.sensor_id+"_"+j
          }
          addAttributeName(attributeName);
          var attributeValue = readingsSplit[j];
          if (attributeValue == "True"){
            attributeValue = 1;
          }else if(attributeValue == "False"){
            attributeValue =0;
          }
          point[attributeName] = attributeValue;
          
        }  
        points.push(point);
      }
      log("Before merge:"+JSON.stringify(points));
      mergePointsByTimeStamp(points);
     
    }
    
  };
  var rootQuery;
  if(req.params.sensor_ids == null || req.params.sensor_ids.length==0){
    response.err = false,
    response.message="No sensors provided",
    sendResponse();
  } else{
    for (var i =0 ;i < req.params.sensor_ids.length; i++){
      var query = ClearBlade.Query();
      //query.ascending("reading_time"); // i dont think we need this as we are going to have to merge the timestamps anyway
      query.greaterThan("reading_time", req.params.startTime);
      query.lessThan("reading_time", req.params.endTime);
      query.columns(["reading_time","sensor_id","sensor_reading"])
      query.equalTo("sensor_id", req.params.sensor_ids[i]);
      query.setPage(0, 0);
      if (i==0){
        rootQuery=query;
      }else{
        rootQuery = rootQuery.or(query);
      }
    }
    var col = ClearBlade.Collection({collectionName:"sensors_data"});
    col.fetch(rootQuery, callback);
  }
  

}

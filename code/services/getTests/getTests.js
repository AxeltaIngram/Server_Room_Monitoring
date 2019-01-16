function getTests(req, resp) {
  var testParams = {
    test_id:"",  //optional
    sensor_id:"",  //optional
    location_id:"",  //optional
    customer_id:"",  //optional
    asset_id:"",  //optional
    pageNum:0,          //optional
    pageSize:0       //optional
  };
  // req.params = testParams;
  
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  ClearBlade.init({request:req});
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {	
      response.err= true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };
  var col = ClearBlade.Collection({collectionName:"Tests"});
  var query = ClearBlade.Query();
  if (typeof req.params.test_id !="undefined" && req.params.test_id!="" ){
    query.equalTo("item_id", req.params.test_id);
  }
  if (typeof req.params.sensor_id !="undefined" && req.params.sensor_id!="" ){
    query.equalTo("sensor_id", req.params.sensor_id);
  }
  if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
    query.equalTo("location_id", req.params.location_id);
  }
  if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
    query.equalTo("customer_id", req.params.customer_id);
  }
  if (typeof req.params.asset_id !="undefined" && req.params.asset_id!="" ){
    query.equalTo("asset_id", req.params.asset_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}

// function getTests(req, resp) {
//   var testParams = {
//     test_id:"",  //optional
//     sensor_id:"",  //optional
//     location_id:"",  //optional
//     customer_id:"",  //optional
//     asset_id:"",  //optional
//     pageNum:0,          //optional
//     pageSize:0       //optional
//   };
//   // req.params = testParams;
  
//   if (typeof req.params.pageNum =="undefined" ){
//     req.params.pageNum=0;
//   }
//   if (typeof req.params.pageSize =="undefined" ){
//     req.params.pageSize=0;
//   }
//   ClearBlade.init({request:req});
//   var response = {
//     err:false,
//     message:"",
//     payload:{}
//   }

//   var col = ClearBlade.Collection({collectionName:"Tests"});
//   var query = ClearBlade.Query();
//   if (typeof req.params.test_id !="undefined" && req.params.test_id!="" ){
//     query.equalTo("item_id", req.params.test_id);
//   }
//   if (typeof req.params.sensor_id !="undefined" && req.params.sensor_id!="" ){
//     query.equalTo("sensor_id", req.params.sensor_id);
//   }
//   if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
//     query.equalTo("location_id", req.params.location_id);
//   }
//   if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
//     query.equalTo("customer_id", req.params.customer_id);
//   }
//   if (typeof req.params.asset_id !="undefined" && req.params.asset_id!="" ){
//     query.equalTo("asset_id", req.params.asset_id);
//   }
//   query.setPage(req.params.pageSize, req.params.pageNum);
  
//   var fetchedData;
//   var count;

//   col.fetch(query, function (err, data) {
//     fetchedData = data
//     log(data)
//     if (err) {
//       resp.error(data)
//     } else {
//       // TOTAL from fetch is just DATA.length, replace it with total that match query
//       if(fetchedData && count !== undefined) {
//         log("col.fetch is returned..")
//         fetchedData.TOTAL = count
//         resp.success(data)
//       }
//     }
//   });

//   col.count(query, function (err, data) {
//     count = data.count
//     if (err) {
//       resp.error(data)
//     } else {
//       if(fetchedData && count !== undefined) {
//         fetchedData.TOTAL = count
//         log("col.count is returned from here");
//         resp.success(fetchedData)
//       }
//     }
//   })
// }
import {Auth}  from 'aws-amplify';
import AWS from "aws-sdk";
import * as R from 'ramda';
AWS.config.update({ region: "us-east-1" });
import DynamoDB from 'aws-sdk/clients/dynamodb';



urlToBlob = (url) => { //react native blobulation does not work for m4a
 return new Promise((resolve, reject) => {
     var xhr = new XMLHttpRequest();
     xhr.onerror = reject;
     xhr.onreadystatechange = () => {
         if (xhr.readyState === 4) {
             resolve(xhr.response);
         }
     };
     xhr.open('GET', url);
     xhr.responseType = 'blob'; // convert type
     xhr.send();
 })
}

 getAccessedFiles = async (deviceIdInput) => {
   const test = {":currDevice" : deviceIdInput};

   return new Promise ((resolve, reject) => {
     Auth.currentCredentials()
     .then(credentials => {
       const db= new DynamoDB.DocumentClient({
         credentials: Auth.essentialCredentials(credentials)
       });
         db.scan(
          {
            TableName: 'useraccessholder',
            FilterExpression: "deviceId = :currDevice",
            ExpressionAttributeValues: test,
            ProjectionExpression: "fileId", //not yet tested
          },
          function (err,data){
            if (data){
               resolve(data);
            } else {
              reject(err);
            }
          }
        );
     })
   })
};

getRandomFile = async (deviceIdInput) => {
  const test = {":currDevice" : deviceIdInput};
  return new Promise ((resolve, reject) => {
    Auth.currentCredentials()
    .then(credentials => {
      const db= new DynamoDB.DocumentClient({
        credentials: Auth.essentialCredentials(credentials)
      });
        db.scan(
         {
           TableName: 'useraccessholder',
           FilterExpression: "deviceId <> :currDevice",
           ExpressionAttributeValues: test,
           ProjectionExpression: "fileId", //not yet tested
         },
         function (err,data){
           if (data){
              resolve(data);
           } else {
             reject(err);
           }
         }
       );
    })
  })
};

logAccessedFile = async (fileAccessed, deviceId) => {
  let uid = await (new Date).getTime()+Math.round(10000000*Math.random());
  const params = {
    TableName: "useraccessholder",
    Item: {
      "id": uid,
      "deviceId": deviceId,
      "fileId": fileAccessed,
    }
  };
  Auth.currentCredentials()
 .then(credentials => {
       const db= new DynamoDB.DocumentClient({
         credentials: Auth.essentialCredentials(credentials)
       });
    db.put(params,
    function(err, data){
     if (data){
       return data;
     } else {
       console.log(err);
     }
    }
  )
  });
}


 export const api = {
   getAccessedFiles,
   logAccessedFile,
   getRandomFile,
   urlToBlob
 }

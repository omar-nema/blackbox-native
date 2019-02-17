import {Auth}  from 'aws-amplify';
import AWS from "aws-sdk";
import * as R from 'ramda';
AWS.config.update({ region: "us-east-1" });
import DynamoDB from 'aws-sdk/clients/dynamodb';


  uploadFile = async (uri) => {
    // create presigned post data using 'createPresignedPost'

    return new Promise ((resolve, reject) => {
      Auth.currentCredentials()
      .then(credentials  => {
        const s3 = new AWS.S3({
          credentials: Auth.essentialCredentials(credentials)
        });

        testOrder = async () => {
          const key = uri.substr(uri.lastIndexOf('/') + 1);

  //          Region: "us-east-1",
            // Credentials: credentials,

          const params = {
            Bucket: 'blackboxnativeedc5f2c09b3d4f4cb0a7ec2c8c484825',
            Fields: { key, /* 'Content-Type': 'CONTENT_TYPE' */ }
          };
          const { url, fields } = await s3.createPresignedPost(params);

          //set them to form data
          const formData = new FormData();
          // R.forEachObjIndexed((value, key) => formData.append(key, value), fields);
          // formData.append('file', { uri });

          await formData.append('file', {
             uri: uri,
             key: key,
             name: 'test.caf'
           })
          const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            };

          const resp = await fetch(url, options);
          console.log(resp)
        }

        testOrder();


      })

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
   uploadFile
 }

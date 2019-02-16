
/********************************
 * EXPERIMENT  *
 ********************************/
app.get(path, function (req, res) {
  var params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };
  // res.json({ error: 'wow not even error' });
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.json({ error: 'Could not load items: ' + err.message });
    }
    res.json({
      data: data.Items.map(item => {
        return item;
      })
    });
  });
}











app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }

  //let queryParms = req.body;

  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});



///this is plan b right heres
app.get('/allitems', function (req, res) {
  var params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.json({ error: 'Could not load items: ' + err.message });
    }
    res.json({
      data: data.Items.map(item => {
        return item;
      })
    });
  });
}

//how will it know the table


app.get(path, function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

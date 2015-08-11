var express = require('express');
var app = express();
var port = 8888;
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;

// Connection URL
var url = 'mongodb://user:password@ds035750.mongolab.com:35750/crosscode';
var documents = 'documents';


// routing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/data', function (req, res) {
  mongo.connect(url, function(err, db) {
    if (err) res.status(500).json({success: false, message: err});
    var collection = db.collection(documents);
    collection.find({}).toArray(function(err, docs) {
      db.close();
      res.json(docs);  
    });  
  });
})


app.get('/data/:id', function (req, res) {
  mongo.connect(url, function(err, db) {
    if (err) res.status(500).json({success: false, message: err});
    var collection = db.collection(documents);
    var params = {};
    if (req.params.id) params._id = ObjectID(req.params.id);
    collection.find(params).toArray(function(err, docs) {
      db.close();
      res.json(docs[0]);  
    });  
  });
})

app.post('/data', function(req, res) {
  if (!req || !req.body) res.status(500).json({success: false, message: 'Empty request'});
  var body = req.body;
  mongo.connect(url, function(err, db) {
    if (err) res.status(500).json({success: false, message: err});
    var collection = db.collection(documents);
    collection.insert([body], function(err, result) {
        if (err) res.status(500).json({success: false, message: err});
        res.json(result);
        db.close();
    });  
  });
});

app.put('/data/:id', function (req, res) {
  if (!req || !req.params.id) res.status(500).json({success: false, message: 'Empty id'});
  if (!req.body) res.status(500).json({success: false, message: 'Empty request'});
  var body = req.body;
  mongo.connect(url, function(err, db) {
    if (err) res.status(500).json({success: false, message: err});
    var collection = db.collection(documents);
    var id = ObjectID(req.params.id);
    delete body._id;
    collection.update({ _id : id }, { $set: body }, function(err, result) {
      if (err) res.status(500).json({success: false, message: err});
      res.json(result);
      db.close();
    }); 
  });
});

app.delete('/data/:id', function(req, res) {
  if (!req || !req.params.id) res.status(500).json({success: false, message: 'Empty id'});
  if (!req.body) res.status(500).json({success: false, message: 'Empty request'});
  var body = req.body;
  mongo.connect(url, function(err, db) {
    if (err) res.status(500).json({success: false, message: err});
    var collection = db.collection(documents);
    collection.remove({ _id : ObjectID(req.params.id) }, function(err, result) {
      if (err) res.status(500).json({success: false, message: err});
      res.json(result);
      db.close();
    }); 
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// start server
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Web server is listening at http://%s:%s", host, port)
});



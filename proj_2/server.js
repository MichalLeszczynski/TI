const port = 1036;
const express = require('express');
const bodyParser= require('body-parser')
var cors = require('cors')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
var db
var db_name = 'people'

  
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors())
  
MongoClient.connect('mongodb://7leszczynski:pass7leszczynski@172.20.44.25/7leszczynski', function(err, database) {
  if (err) return console.log(err)
  db = database
  console.log('Connect OK');
})
  

app.listen(port,function() {
   console.log('listening on .........')
})
  
app.get('/', function(req,res) {
  res.send('Aplikacja CRUD - node.js')
})
  
app.get('/form', function(req,res) {
  res.sendFile(__dirname + '/form.html')
})
  
app.post('/add', function( req,res ) {
   console.log(req.body)
   db.collection(db_name).save(req.body, function(err,result) {
      if (err) return console.log(err)
      console.log('Rekord dodany do bazy')
      res.redirect('/list')
   })
})
  
app.get('/list', function(req, res) {
  var cursor = db.collection(db_name).find().toArray(function(err, results) {
     if (err) return console.log(err);
     res.setHeader('Content-type', 'application/json');
     res.end( JSON.stringify(results));
     console.log(results) ;
  })
});

app.put('/update/:id', function( req,res ) {
    var query = { _id: new mongodb.ObjectID(req.params.id)};
    var new_values = { $set: req.body };
    var cursor = db.collection(db_name).updateOne(query, new_values, function(err, obj) {
    if (err) throw err;
    console.log("1 document updated");
      });
  });

 app.delete('/delete/:id', function(req, res) {
    var query = { _id: new mongodb.ObjectID(req.params.id)};
    var cursor = db.collection(db_name).deleteMany(query, function(err, obj) {
    if (err) throw err;
    console.log('deleting id:' + req.params.id);
      });
  });
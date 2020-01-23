const port = 1036;
const express = require('express');
const bodyParser= require('body-parser')
var cors = require('cors')
const mongodb = require('mongodb')
const router = express.Router();
var session = require('express-session')

const MongoClient = mongodb.MongoClient
var db
var db_name = 'people'
var db_users = 'users'

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://pascal.fis.agh.edu.pl" }))
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  // key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 6000000
  }
}));


MongoClient.connect('mongodb://7leszczynski:pass7leszczynski@172.20.44.25/7leszczynski', function(err, database) {
  if (err) return console.log(err)
  db = database
  console.log('Connect OK');
})
  


app.listen(port,function() {
   console.log('listening on .........')
})
  
  
router.post('/add', function( req,res ) {
   console.log(req.body)
   db.collection(db_name).save(req.body, function(err,result) {
      if (err) return console.log(err)
      console.log('Rekord dodany do bazy')
      db.collection(db_name).find().forEach( function (x) { x.comfort = parseInt(x.comfort); db.collection(db_name).save(x); })
      res.redirect('/list')
      
   })
})
  
router.get('/list', function(req, res) {
  var cursor = db.collection(db_name).find().toArray(function(err, results) {
     if (err) return console.log(err);
     res.setHeader('Content-type', 'application/json');
     res.end( JSON.stringify(results));
     console.log(results) ;
  })
});

router.put('/update/:id', function( req,res ) {
    var query = { _id: new mongodb.ObjectID(req.params.id)};
    var new_values = { $set: req.body };
    var cursor = db.collection(db_name).updateOne(query, new_values, function(err, obj) {
    if (err) throw err;
    db.collection(db_name).find().forEach( function (x) { x.comfort = parseInt(x.comfort); db.collection(db_name).save(x); })
    console.log("1 document updated");
        res.send("Zaktualizowano.")
      });
  });

 router.delete('/delete/:id', function(req, res) {
    var query = { _id: new mongodb.ObjectID(req.params.id)};
    var cursor = db.collection(db_name).deleteMany(query, function(err, obj) {
    if (err) throw err;
      console.log('deleting id:' + req.params.id);
      res.send("Usunięto.")
      });
  });

  router.post('/register', function( req,res ) {
    console.log(req.body)
    db.collection(db_users).save(req.body, function(err,result) {
       if (err) return console.log(err)
       console.log('Rekord dodany do bazy')
       res.send('Zarejestrowano')       
    })
 })

  router.post('/login', function(req, res) {
    var cursor = db.collection(db_users).find(req.body).toArray(function(err, results) {
       if (err) return console.log(err);
       if (results.length) {
        req.session.user = req.body.nick;
        console.log("Zalogowano", req.body);
        res.send("Zalogowano")
       }
    })
  });

router.post('/logout', function(req, res) {

    req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      var for_logged = '' 
      var result =  "Wylogowano"
      var logout = ''
      var login = '<input type="button" value="Logowanie" onclick="_login_form()"/>'
      var register = '<input type="button" value="Rejestracja" onclick="_register_form()"/>'

      res.send({for_logged: for_logged, result: result, logout: logout, login: login, register: register});

    });

});

router.get('/init', function(req, res) {
  var for_logged = ''
  var result = ''
  var logout = ''
  var login = ''
  var register = ''
  for(var o in req.session) {
    console.log(o);
  }

  console.log("sess", req.session.user);

  if (req.session.user) {
    for_logged = '<input type="button" value="Pobranie danych z bazy" onclick="_list()"/> \
    <input type="button" value="Dane zgromadzone w lokalnej bazie" onclick="_list_local()"/> \
    <input type="button" value="Dodanie rekordu do bazy" onclick="_ins_form()"/> \
    <input type="button" value="Usuniecie rekordu z bazy" onclick="_del_list()"/> \
    <input type="button" value="Poprawa rekordu w bazie" onclick="_upd_list()"/> \
    <input type="button" value="Statystyki" onclick="stats()"/>'; 
    result =  ''
    logout = ' <input type="button" value="Wyloguj" onclick="_logout()"/>'
   }
   else {
    for_logged = ''
    result = ''
    logout = ''
    var login = '<input type="button" value="Logowanie" onclick="_login_form()"/>'
    var register = '<input type="button" value="Rejestracja" onclick="_register_form()"/>'
   }
   res.send({for_logged: for_logged, result: result, logout: logout, login: login, register: register});
});

app.use('/', router);

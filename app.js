var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/',function(req,res,next){
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      res.render('home');
    })
  });
});

app.post('/', function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT id FROM workouts", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context = JSON.stringify(rows[rows.length - 1]);
      res.send(context);
    });
  });
});
app.post('/delete', function(req,res,next){
  mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.body.rowId], function(err){
    if(err){
      next(err);
      return;
    }
    res.send(null);
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Listening in on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

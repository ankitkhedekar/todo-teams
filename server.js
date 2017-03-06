var restify = require('restify');
var mongoose = require('mongoose');
var Team = require('./models/team');
var Task = require('./models/task');


var db = mongoose.connection;

mongoose.connect('mongodb://localhost/todos');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection established');
});

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.CORS());

server.opts(/.*/, function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
  res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
  res.send(200);
  return next();
});


server.get('/hello/:name', function(req, res, next){
  res.send('hello ' + req.params.name);
  next();
});

server.get('/team/', function(req, res, next){
  Team.getAllTeams(function(err, t) {
    if (err){
      res.send(err)
    }
    res.json(t); // return all teams in JSON format
    return next();  
  });
});

server.post('/team', function(req, res){
  Team.createNewTeam(req.body.name, req.body.color, function(err, savedTeam){
    if (err){
      console.error(err);
      return res.send(err);
    }
    return res.send(savedTeam);
  });
});

server.get('/task', function(req, res){
  Task.getAllTasks(function(err, t) {
    if (err){
      res.send(err)
    }
    res.json(t); // return all todos in JSON format
  });
});

server.post('/task', function(req, res){
  Task.createNewTask(req.body, function(err, savedTask){
    if (err){
      console.error(err);
      return res.send(err);
    }
    return res.send(savedTask);
  });
});


server.patch('/task/:taskId', function(req, res, next){
  Task.updateTaskById(req.params.taskId, req.body.status, function(err, updatedTeam){
    if(err){
      return next(err)
    }
    return res.send(updatedTeam);
  });
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
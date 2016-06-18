var restify = require('restify');
var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection established');
});

var server = restify.createServer();
server.use(restify.bodyParser()); 


var Task = mongoose.model('Task', {
  title : String,
  desc: String,
  forTeam: String,
  byTeam: String,
  createdAt: Date
});


server.get('/hello/:name', function(req, res, next){
  res.send('hello ' + req.params.name);
  next();
});

server.get('/task', function(req, res){
  Task.find({}, function(err, t) {
    if (err){
      res.send(err)
    }
    res.json(t); // return all todos in JSON format
  });
});

server.post('/task', function(req, res){
  var newTask = new Task({
    title : req.body.title,
    desc: req.body.desc,
    forTeam: req.body.forTeam,
    byTeam: req.body.byTeam,
    createdAt: new Date()
  });

  newTask.save(function(err, savedTask){
    if (err){
      console.error(err);
      return res.send(err);
    }

    return res.send("Task created");
  });
});





server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
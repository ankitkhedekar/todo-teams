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
server.use(restify.CORS());

server.opts(/.*/, function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
  res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
  res.send(200);
  return next();
});


var Task = mongoose.model('Task', {
  title : {
    type: String,
    required: [true]
  },
  desc: {
    type:String,
    required: [true]
  },
  forTeam: {
    type:String,
    required: [true]
  },
  byTeam: {
    type:String,
    required: [true]
  },
  createdAt: {
    type:Date,
    required: [true]
  },
  status: {
    type:String,
    required: [true]
  },
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
    createdAt: new Date(),
    status: "active"
  });

  var validationErr = newTask.validateSync();
  if(validationErr){
    return res.send(400, validationErr.errors);
  }

  newTask.save(function(err, savedTask){
    if (err){
      console.error(err);
      return res.send(err);
    }
    return res.send("Task created");
  });
});


server.patch('/task/:taskId', function(req, res, next){
  var updateobj = {};
  var query = {'_id': req.params.taskId};
  if(req.body.status){
    updateobj["status"] = req.body.status;
  }

  Task.findOneAndUpdate(query, updateobj, function(err){
    if(err){
      return next(err)
    }
    return res.send("patched");
  });
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
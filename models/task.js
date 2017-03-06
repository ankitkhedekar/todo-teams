var mongoose = require('mongoose');

var mTask = mongoose.model('Task', {
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
  updatedAt: {
    type:Date
  },
  status: {
    type:String,
    required: [true]
  },
});

exports.getAllTasks = function(callback){
  mTask.find({}, callback);
};

exports.createNewTask = function(taskData, callback){
  var newTask = new mTask({
    title : taskData.title,
    desc: taskData.desc,
    forTeam: taskData.forTeam,
    byTeam: taskData.byTeam,
    createdAt: new Date(),
    status: "active"
  });

  var validationErr = newTask.validateSync();
  if(validationErr){
    return res.send(400, validationErr.errors);
  }

  newTask.save(callback);
};


exports.updateTaskById = function(taskId, status, callback){
  var updateobj = {};
  var query = {'_id': taskId};
  if(status){
    updateobj["status"] = status;
    updateobj["updatedAt"] = new Date();
  }

  mTask.findOneAndUpdate(query, updateobj, {new: true}, callback);
};
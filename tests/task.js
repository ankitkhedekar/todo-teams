var should = require('should');
var mongoose = require('mongoose');
var Task = require('../models/task');

describe('Testing task model', function(){
  var tmpId;
  
  before(function(done){
    var db = mongoose.connection;
    mongoose.connect('mongodb://localhost/todos');
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log('Connection established');
      done();
    });
  });

  
  it('should create a new task', function(done){
    var data = {
      title : 'Test'+new Date().getTime(),
      desc: 'This task was generated from unit test',
      forTeam: 'Team A',
      byTeam: 'Team B',
      createdAt: new Date(),
      status: "active"
    }
    Task.createNewTask(data, function(err, savedTask){
      should.equal(err, undefined, 'Got err while creating new task');
      savedTask.should.have.property('_id');
      tmpId = savedTask._id;
      done();
    });
  });



  it('should get task list', function(done){
    Task.getAllTasks(function(err, t) {
      should.equal(err, undefined, 'Got err while getting task list');
      t.length.should.be.above(0);
      t[0].should.have.property('_id');
      done();
    });
  });



  it('should update a task', function(done){
    Task.updateTaskById(tmpId, 'completed', function(err, updatedTeam){
      should.equal(err, undefined, 'Got err updating task with id:'+tmpId);
      updatedTeam.should.have.property('_id', tmpId);
      updatedTeam.should.have.property('status', 'completed');
      done();
    });
  });
});
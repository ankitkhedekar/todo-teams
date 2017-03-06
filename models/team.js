var mongoose = require('mongoose');

var mTeam = mongoose.model('Team',{
  name : {
    type: String,
    required: [true]
  },
  color:{
    type:String,
    required: [true]
  }
});

exports.getAllTeams = function(callback){
  mTeam.find({}, callback);
}

exports.createNewTeam = function(name, color, callback){
  var newTeam = new mTeam({
    name : name,
    color : color
  });

  newTeam.save(callback);
}
/*
 *  INDEX FILE FOR USER COMPONENT
 *  Contains all functions that are to be called from other components, as well as emitter listeners
 */

//Dependencies
const config = require('../../config.js');
const main = require('./main.js');

//Create the container
var index = {};

//Gets user documents by filter
//Options:
//first = true: only returns first document (not as an array)
//privacy = true: the output will reflect privacy settings
//onlyPaxterians = true: return only the data of accepted paxterya players
index.get = function(filter, options, callback){
  main.get(filter, options, callback);
};

//Deletes documents based on filter
index.delete = function(filter, options, callback) {
  main.delete(filter, options, callback);
};

//Replaces the document that matches the input with the input
index.edit = function(input, options, callback) {
  main.edit(input, options, callback);
};

//Adds modifier to key of first documents matching filter 
index.modify = function(filter, key, modifier, options, callback){
  main.modify(filter, key, modifier, options, callback);
};

//Triggers the update of all IGNs and Nicks from all users
index.updateNicks = function(){
  main.updateNicks();
};

setTimeout(function(){
  emitter.on('user_left', (discord_id) => {
    main.delete({discord: discord_id}, false, function(err) {
      if(err) global.log(0, 'Couldnt delete user that left', {discord_id: discord_id});
    });
  });

  emitter.on('user_banned', (discord_id) => {
    main.delete({discord: discord_id}, false, function(err) {
      if(err) global.log(0, 'Couldnt delete user that got banned', {discord_id: discord_id});
    });
  });

  emitter.on('application_accepted_joined', (app) => {
    index.get({discord: app.discord}, {first: true}, function(err, doc){
      if(!err && doc){
        doc.mcName = app.mcName;
        doc.mcUUID = app.mcUUID;
        doc.birth_year = app.birth_year;
        doc.birth_month = app.birth_month;
        doc.country = app.country;
        doc.publish_age = app.publish_age;
        doc.publish_country = app.publish_country;
        doc.status = 1;

        index.edit(doc, false, function(err, doc){
          if(err || !doc) global.log(0, 'Failed modifying accepted user', {application: doc, err: err});
        });
      }else{
        if(err) global.log(0, 'Couldnt get accepted user', {application: doc, err: err});
      }
    });
  });
}, 1);

//Export the container
module.exports = index;
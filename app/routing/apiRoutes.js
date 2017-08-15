var path = require("path");
var bodyParser = require("body-parser");
var friendData = require('../data/friends.js');


module.exports = function(app){
  app.get("/api/friends", function(req, res){
    res.json(friendData);
  });

  app.post('/api/friends', function(req, res){

    var newFriend = req.body;

    //converts any scores of 1 or 5 to actual integers
    for(var i = 0; i < newFriend.scores.length; i++) {
      if(newFriend.scores[i] == "1 (Strongly Disagree)") {
        newFriend.scores[i] = 1;
      } else if(newFriend.scores[i] == "5 (Strongly Agree)") {
        newFriend.scores[i] = 5;
      } else {
        newFriend.scores[i] = parseInt(newFriend.scores[i]);
      }
    }

    var differencesArray = [];

    //runs a for loop to start comparing between all friends in the array friends
    for(var i = 0; i < friendData.length; i++) {

      var compareFriend = friendData[i];
      var totalDifference = 0;

      //runs a for loop to get the total difference in scores between 2 users
      for(var k = 0; k < compareFriend.scores.length; k++) {
        var differenceOneScore = Math.abs(compareFriend.scores[k] - newFriend.scores[k]); //takes absolute value of score difference
        totalDifference += differenceOneScore;
      }

      differencesArray[i] = totalDifference; // pushes the difference into an array for comparison later
    }

    var bestFriendNum = differencesArray[0];
    var bestFriendIndex = 0;
    //runs a for loop to see which friend has the lowest score difference between user
    for(var i = 1; i < differencesArray.length; i++) {
      if(differencesArray[i] < bestFriendNum) {
        bestFriendNum = differencesArray[i];
        bestFriendIndex = i;
      }
    }

    friendData.push(newFriend);

    res.json(friendData[bestFriendIndex]);
  	});

};

Meteor.startup(function () {

  Meteor.methods({
    listIssues: function () {
      return GitHubInterface.listIssues('sebdah', 'dynamic-dynamodb');
    }
  });

});


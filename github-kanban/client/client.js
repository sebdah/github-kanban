Meteor.startup(function () {

  Meteor.call('listIssues', function (error, issues) {
    issues.forEach(function (issue) {
      console.dir(issue);
    })
  });

});


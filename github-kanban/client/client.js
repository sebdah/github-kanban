Meteor.startup(function () {

});


Template.welcome.issues = function () {
  var issues = Meteor.call('listIssues', function (error, issues) { return issues; });
  console.log(issues);
}


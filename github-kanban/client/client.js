Meteor.startup(function() {
  if (Meteor.user()) {
    var accessToken = Meteor.user().profile.github.accessToken;

    Meteor.call(
      'listIssues',
      Meteor.user().profile.github.username,
      'dynamic-dynamodb',
      Meteor.user().profile.github.accessToken,
      function (error, issues) {
        Session.set('issues', issues);
      }
    );
  }
})

Deps.autorun(function (computation) {
  var issues = Session.get('issues');
  if (!issues) {
    console.log('No issues');
    return;
  }
  computation.stop();
  Template.welcome.issues = issues;
  console.dir(issues);
});
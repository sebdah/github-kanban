/**
* Startup
*/
Meteor.startup(function() {
  Session.setDefault('issues', undefined);
  Session.setDefault('currentRepo', undefined);
});

/**
* Global functions
*/
function updateIssues (repository) {
  if (Meteor.user()) {
    var accessToken = Meteor.user().profile.github.accessToken;

    Meteor.call(
      'listIssues',
      Meteor.user().profile.github.username,
      repository,
      Meteor.user().profile.github.accessToken,
      function (error, issues) {
        console.log('Retrieved new issues')
        Session.set('issues', issues);
      }
    );
  }
}

/**
* Template repository
*/
Template.repository.currentRepo = function () { return Session.get('currentRepo'); }
Template.repository.events = {
  'keydown input#repo' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      Session.set('currentRepo', document.getElementById('repo').value);
      updateIssues(Session.get('currentRepo'));
      console.log('Changed repo to ' + Session.get('currentRepo'));
    }
  }
}

/**
* Template issues
*/
Template.issues.issues = function () { return Session.get('issues'); }

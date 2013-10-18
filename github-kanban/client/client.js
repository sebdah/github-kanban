/**
* Startup
*/
Meteor.startup(function() {
  Session.setDefault('issues', undefined);
  Session.setDefault('githubRepo', undefined);
  Session.setDefault('githubUser', undefined);
});

/**
* Global functions
*/

// Check if a GitHub repository exists for a given user
function repoExists (user, repo, callback) {
  Meteor.apply(
    'listUserRepos',
    [
      user,
      Meteor.user().profile.github.accessToken
    ],
    onResultReceived = function (error, result) {
      var response = false;

      for (var i = 0; i < result.length; i++) {
        if (result[i].name == repo) {
          response = true;
        }
      }

      if (response)
        console.log('Repo "' + repo + '" exists.');
      else
        console.log('Repo "' + repo + '" does not exist.');

      if (callback && typeof(callback) === 'function') {
        callback(error, response);
      }
    }
  );
}


// Change user and repository
function changeUserAndRepo () {
  if (!Meteor.user()) return;
  var githubUser = Meteor.user().profile.github.username;
  var githubRepo = document.getElementById('repo').value;

  repoExists(githubUser, githubRepo, function (error, exists) {
    if (exists) {
      Session.set('githubRepo', githubRepo);
      Session.set('githubUser', githubUser);
      console.log('Changed GitHub repo to ' + Session.get('githubRepo'));
      console.log('Changed GitHub user to ' + Session.get('githubUser'));

      Meteor.apply(
        'listIssues',
        [
          Session.get('githubUser'),
          Session.get('githubRepo'),
          Meteor.user().profile.github.accessToken
        ],
        function (error, issues) {
          if (error) {
            console.log('An error occurred retrieving issues: ' + error);
            Session.set(
                'listIssuesError',
                'An error occurred retrieving issues. Please try again');
          } else {
            console.log('Retrieved issues');
            Session.set('issues', issues);
            Session.set('listIssuesError', undefined);
          }
        }
      );
    } else {
      Session.set(
        'listIssuesError',
        'Repository "' + githubUser + '/' + githubRepo + '" does not exist');
    }
  })
}

/**
* Template main
*/
Template.main.user = function () { return Meteor.user(); }

/**
* Template repository
*/
Template.repository.user = function () { return Meteor.user(); }
Template.repository.rendered = function () {
  document.getElementById('repo').value = Session.get('githubRepo');
}

Template.repository.events = {
  'keydown input#repo' : function (event) {
    if (event.which == 13)
      changeUserAndRepo();
  }
}

/**
* Template issues
*/
Template.issues.issues = function () { return Session.get('issues'); }
Template.issues.listIssuesError = function () { return Session.get('listIssuesError'); }

/**
* Dependencies
*/
Deps.autorun(function(comp) {
  if (Meteor.user()) {
    Session.set('githubUser', Meteor.user().profile.github.username);
  }
});

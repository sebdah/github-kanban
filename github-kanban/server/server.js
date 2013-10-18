Meteor.startup(function () {

  Meteor.methods({
    listIssues: function (user, repo, accessToken) {
      return GitHubInterface.listIssues(user, repo, accessToken);
    },
    listUserRepos: function (user, accessToken) {
      return GitHubInterface.listUserRepos(user, accessToken);
    }
  });

});


Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
      user.profile = options.profile;
    }

    user.profile.github = {};
    user.profile.github.accessToken = user.services.github.accessToken;
    user.profile.github.email = user.services.github.email;
    user.profile.github.username = user.services.github.username;

    return user;
});

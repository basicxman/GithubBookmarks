var retrieve_results = function(user) {
  var params = {
    url: 'https://api.github.com/users/' + user + '/watched',
    key: 'callback',
    data: {
      per_page: this.per_page,
      page: this.page
    }
  }

  snack.JSONP(params, function(data_set) {
    this.repos = this.repos.concat(data_set.data)

    if (data_set.data.length == 100) {
      this.page += 1;
      retrieve_results.bind(this, user).apply();
    } else {
      this.table.render(this.repos);
      Tempo.prepare("numrepos").render({ num: this.repos.length });
    }
  }.bind(this))
}

var retrieve_following = function(user) {
  var params = {
    url: 'https://api.github.com/users/' + user + '/following',
    key: 'callback'
  }

  snack.JSONP(params, function(data_set) {
    this.following = data_set.data;
    Tempo.prepare("following").render(this.following);
    Tempo.prepare("numfollowing").render({ following: this.following.length });
  }.bind(this))
}

var github_data = {
  per_page: 100,
  page: 1,
  repos: [],
  following: []
}

var regex = new RegExp("[\\?&]user=([^&#]*)");
var results = regex.exec(window.location.href);
if (results == null)
  results = "kaerast";
else
  results = results[1];

// Set the value of the input box
document.getElementById("user").value = results;

snack.wrap(".container").addClass("loading");
github_data.table = Tempo.prepare("repos").notify(function(event) {
  if (event.type == TempoEvent.Types.RENDER_COMPLETE) {
    snack.wrap(".container").removeClass("loading");
    snack.wrap("#repos-loading").addClass("loading");
  }
});
github_data.table.starting();

// Retrieve and render data.
retrieve_following.bind(github_data, results).apply();
retrieve_results.bind(github_data, results).apply();

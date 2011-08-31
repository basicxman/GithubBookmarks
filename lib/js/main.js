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
      Tempo.prepare("repos").render(this.repos);
      Tempo.prepare("header").render({ num: this.repos.length });
    }
  }.bind(this))
}

var github_data = {
  per_page: 100,
  page: 1,
  repos: []
}

var regex = new RegExp("[\\?&]user=([^&#]*)");
var results = regex.exec(window.location.href);
if (results == null)
  results = "kaerast";
else
  results = results[1];

document.getElementById("user").value = results;
retrieve_results.bind(github_data, results).apply();

var regex = new RegExp("[\\?&]user=([^&#]*)");
var results = regex.exec(window.location.href);
if (results == null)
  results = "kaerast";
else
  results = results[1];


var params = {
  url: 'https://api.github.com/users/'+results+'/watched',
  key: 'callback',
  data: {per_page: 100}
}

snack.JSONP(params, function (data){
  console.log(data) // news!
  Tempo.prepare("repos").render(data.data);
})
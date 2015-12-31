
var latlng = '49.280233,-123.117980';
var client_id = 'K1GIWTMS14PAA20PHUZXAFQMGJRIXM0FYTXUIC3AEEEF3QXT';
var client_secret = 'GB3U3CIDFVZRDOFR1SU5AY3KYYYLAGC2WI1QMUZNS5AU0PEU';
var fUrl = 'https://api.foursquare.com/v2/venues/search?ll='+ latlng +'&client_id='+ client_id +'&client_secret='+ client_secret +'&v=20151259&m=foursquare';
var foursquare = '' 


$.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ latlng +'&client_id='+ client_id +'&client_secret='+ client_secret +'&v=20151259&m=foursquare',
    function(data) {
        $.each(data.response.venues, function(i,venues){
            content = '<p>' + venues.name + '</p>';
            $(content).appendTo("#names");
       });
});
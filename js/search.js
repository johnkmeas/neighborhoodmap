  function initialize() {
    // Set the zoom level and center position of map
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(49.179282, -122.820615)
    };
    // Assign var map to a new google map and assigned to id 'map'
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // Call markers function to load the map markers

};
// Load the Map
google.maps.event.addDomListener(window, 'load', initialize);
  // Flickr api 
var apiKey = '0b8f5be71394506b9809998b0caaec59';
var secret = '575cfa465225bbf5';
http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=29e62f8cfc70c951fad22716511f1002&user_id=user_id_x&format=json
 
var ul = $('#gallery');
var url = 'http://api.flickr.com/services/feeds/photos_public.gne?id=45038025@N00&format=json&jsoncallback=?';
imgs = '';

$.getJSON(url, function(data) {
    imgs = data;

    $(data.items).each(function(i, item) {
        ul.append($('<li><img src="' + item.media.m.slice(0,-5) + 'b.jpg" /><div class="caption">'+item.title+'</div></li>'))
        if (i == 40) return false
    });
    $('#images div').click(function() {
        $('#images div').removeClass('selected')
        $(this).addClass('selected')
    });
})
ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

var Record = function( name) {
    //this.id = id;
    this.name = name;
    //this.homeTown = homeTown;
};

var ViewModel = function(records) {
    var self = this;
    //self.homeTowns = ko.observableArray(homeTowns);
    self.records = ko.observableArray(
    ko.utils.arrayMap(records, function(i) {
        return new Record(i.name);
    }));

    //self.idSearch = ko.observable('');
    self.nameSearch = ko.observable('');
    //self.townSearch = ko.observable('');

    self.filteredRecords = ko.computed(function() {
        return ko.utils.arrayFilter(self.records(), function(r) {
            return (self.nameSearch().length == 0 || ko.utils.stringStartsWith(r.name.toLowerCase(), self.nameSearch().toLowerCase())) 
        });
    });
};



var data = [
{
    id: 1,
    name: "tynehead",
    homeTown: "Portland",
    place: {lat: 49.181365, lng: -122.757452}},
{
    id: 2,
    name: "greenTimbers",
    homeTown: "Portland",
    place: {lat: 49.179204, lng: -122.821221}},
{
    id: 3,
    name: "capilano",
    homeTown: "Portland",
    place: {lat: 49.352239, lng: -123.114227}},
{
    id: 4,
    name: "burnaby",
    homeTown: "Portland",
    place: {lat: 49.194429, lng: -122.999024}},
{
    id: 5,
    name: "campbell",
    homeTown: "Portland",
    place: {lat: 49.030394, lng: -122.669163}},
     ];

ko.applyBindings(new ViewModel(data));
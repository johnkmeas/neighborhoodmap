# Neightborhood Map

This is the my first application built from scratch using KnockoutJS. It loads a google map and custom map markers generated from location data. The markers animate and reveal an info window when clicked. The info windows display the name of the park and details of the nearest coffee shop.

### How to run applications
#### Clone repository
In terminal run `git clone https://github.com/johnkmeas/neighborhoodmap.git`


#### Run in Browser
- Open index.html in browser
- Toggle the list menu with the button in the UI
- Filter the list names and associated map markers by typing into the input field
- Clicking a name in the list will trigger the the associated map marker
- Clicking on a map marker will open an info window for the location

## KnockoutJs
KnockoutJs is a javascript library that allows the UI to update dynamically. I was able to filter the list and associated markers with the input filter.

## Foursquare Api
Sent request to Foursquare and received Json data for each location. I used the data to populate each info window.


### Things to do later
- Get authorization credentials to get personalized data
- Display images from Foursquare venue photos.

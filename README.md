# Neightborhood Map

This is the my first application built from scratch using KnockoutJS. It loads a google map and custom map markers generated from location data. The markers animate and reveal an info window when clicked. The info windows display the name of the park and details of the nearest coffee shop.

### How to run applications
#### Download repository
In terminal run `git clone https://github.com/johnkmeas/neighborhoodmap.git`

#### Run in Browser
Open index.html in browser

## KnockoutJs
KnockoutJs is a javascript library that allows the UI to update dynamically. I was able to filter the list and associated markers with the input filter.

## Foursquare Api
Sent request to Foursquare and received Json data for each location. I used the data to populate each info window.


### Things to do later
- Get authorization credentials to get personalized data
- Display images from Foursquare venue photos.

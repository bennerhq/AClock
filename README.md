## Screenshot
![Analog Clock Screenshot](https://github.com/bennerhq/AClock/blob/main/images/screenshot.png)

# Analog Clock Application 

## Description
The Analog Clock Application is a web-based project that displays multiple analog clocks 
for different time zones. The application allows users to view the current time in various 
cities around the world, with the option to display a single clock or multiple clocks 
simultaneously. The clocks are rendered using HTML5 Canvas and JavaScript, providing a 
visually appealing and interactive experience.

## Project 
The main purpose of this project was to explore and learn how to use GitHub 
Copilot with Visual Studio Code!

## Features
- Display multiple analog clocks for different time zones.
- Option to display a single clock or multiple clocks.
- Automatic time zone detection based on city names.
- Random time zone selection for dynamic clock display.
- Responsive design that adjusts clock sizes based on screen dimensions.
- Auto-generated time zone data file for easy updates.


## Files and Structure
### index.html
The main HTML file that sets up the structure of the web page. It includes links to CSS for 
styling and JavaScript files for functionality.

### css/index.css
The CSS file that contains styles for the clock application, including layout, fonts, and colors.

### js/main.js
The main JavaScript file that initializes the application, handles user interactions, and 
manages the creation and display of clocks.

### js/aclock.js
A JavaScript file that defines the `AnalogClock` class, responsible for drawing the 
analog clock on a canvas element.

### js/locations.js
A JavaScript file that contains default locations for the clock application.

### js/timezones.js
A JavaScript file that maps location objects to time zone objects and provides functions 
for handling time zones.

### js/tz_objects.js
An auto-generated JavaScript file that contains the time zone data. This file is created by 
the `removeDuplicates` function in `timezones.js`.

### manifest.json
A JSON file that defines the web app manifest, including the app's name, icons, and display 
settings.

## How to Use
1. Open `index.html` in a web browser.
2. The application will automatically display clocks based on the default locations or the
locations specified in the URL parameters.
4. Use the URL parameters to customize the display:
   - `locations`: A comma-separated list of city names or indices of default locations.
   - `single`: Set to `true` to display a single clock.
   - `interval`: The interval in minutes for updating the clock when in single or random mode.

Example URL: `index.html?locations=?,Copenhagen,New York`
This example will display three clocks, a random location, Copenhagen and New York.

## Development
To modify the application, update the relevant JavaScript and CSS files. The `removeDuplicates` 
function in `timezones.js` can be used to generate a new `tz_objects.js` file with unique time zones.

## License
This project is licensed under the MIT License.


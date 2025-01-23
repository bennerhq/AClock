/**
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jens@bennerhq.com> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   
 * ----------------------------------------------------------------------------
 */

/**
 * Default locations for the clock application.
 * 
 * @constant {string[]}
 */
export const DEFAULT_LOCATIONS = [
    "Copenhagen",
    "Perth",
    "New York"
];

/**
 * Default color scheme for the clock.
 * 
 * @property {string} background - The background color of the clock.
 * @property {string} frame - The color of the clock frame.
 * @property {string} markers - The color of the clock markers.
 * @property {string} seconds - The color of the seconds hand.
 * @property {string} minutes - The color of the minutes hand.
 * @property {string} hours - The color of the hours hand.
 */
export const DAY_COLOR_SCHEME = {
    background: 'white', 
    frame: 'black',
    markers: 'black',
    seconds: 'red', 
    minutes: 'black', 
    hours: 'black', 
};

export const NIGHT_COLOR_SCHEME = {
    background: 'black', 
    frame: 'black',
    markers: 'white',
    seconds: 'red', 
    minutes: 'white', 
    hours: 'white', 
};

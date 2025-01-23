/**
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jens@bennerhq.com> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   
 * ----------------------------------------------------------------------------
 */

/***
 * @fileoverview Main application file
 */

import { AnalogClock } from './aclock.js';
import { DEFAULT_LOCATIONS, DAY_COLOR_SCHEME, NIGHT_COLOR_SCHEME } from './defaults.js';
import { randomTimezone, cityTimezone, defaultTimezone } from './timezones.js';
import { sunrise, sunset } from './sun.js';

function createClocks(clocks) {
    const clockContainer = document.getElementById('clock-container');
    let sizeW = (window.innerWidth - 20) / clocks.length;
    while (sizeW > window.innerHeight - 20) sizeW -= 1;
    let sizeH = (window.innerHeight - 20) / clocks.length;
    while (sizeH > window.innerWidth - 20) sizeH -= 1;

    let clockSize = Math.max(sizeW, sizeH);
    clockContainer.style.flexDirection = clockSize == sizeW ? 'row' : 'column';

    clocks.forEach((clock, idx) => {
        const clockWrapper = createClockElement(clock, idx, clockSize);
        clockContainer.appendChild(clockWrapper);
    });
}

function updateClock(clock, interval) {
    if (interval && clock.random) {
        const nowMinute = clock.analog.getMinutes();
        if (clock.lastMinute !== nowMinute) {
            clock.tickMinutes += nowMinute - clock.lastMinute;
            if (clock.tickMinutes >= interval) {
                clock = {... clock, ...randomTimezone()};
                clock.analog.setTimezone(clock.timezone);
                clock.tickMinutes = 0;
            }
            clock.lastMinute = nowMinute;
        }
    }

    const now = clock.analog.getDate().getTime();
    const dayColor = (now > clock.sunrise) && (now < clock.sunset);

    clock.analog.setColorScheme(dayColor ? DAY_COLOR_SCHEME : NIGHT_COLOR_SCHEME);
    clock.analog.drawClock();

    return clock;
}

function createClockElement(clock, idx, clockWidth) { 
    const clockWrapperID = `clockWrapper-${idx}`;
    let clockWrapper = document.getElementById(clockWrapperID);
    if (clockWrapper === null) {
        clockWrapper = document.createElement('div');
        clockWrapper.id = clockWrapperID;
        clockWrapper.className = 'clock-wrapper';
        clockWrapper.innerHTML = `
            <canvas id="canvas-${idx}" class="clock"></canvas>
            <div id="cityName-${idx}"></div>
        `;
    }
    clockWrapper.style.width = `${clockWidth}px`;
    clockWrapper.style.height = `${clockWidth}px`;

    const canvas = clockWrapper.querySelector(`#canvas-${idx}`);
    canvas.width = clockWidth * 0.97;
    canvas.height = clockWidth * 0.97;

    clock.analog = new AnalogClock(canvas, clock.city, clock.timezone, DAY_COLOR_SCHEME);

    const clockDate = clock.analog.getDate();
    const sunriseTime = sunrise(clockDate, clock.lat, clock.lng).getTime();
    const sunsetTime = sunset(clockDate, clock.lat, clock.lng).getTime();
    clock.sunrise =  sunriseTime + (clock.timezone - 1) * 60 * 60 * 1000;
    clock.sunset =  sunsetTime + (clock.timezone - 1) * 60 * 60 * 1000;

    updateClock(clock, 0);

    return clockWrapper;
}

function main() {
    let search = window.location.search;
    if (search) {
        localStorage.setItem('search', search);
    } else {
        search = localStorage.getItem('search') || '';
    }
    const urlParams = new URLSearchParams(search);

    const interval = parseInt(urlParams.get('interval')) || 1;
    const locations = (urlParams.get('locations') || '').split(',').map(loc => {
        const idx = parseInt(loc);
        return isNaN(idx) ? loc : DEFAULT_LOCATIONS[idx];
    }).filter(Boolean);

    let clocks = locations.map(location => {
        const random = location === "?";
        const timezone = random ? randomTimezone() : cityTimezone(location);
        return timezone ? {... {random, tickMinutes: 0, lastMinute: 0}, ...timezone} : null;
    }).filter(Boolean);
    if (clocks.length === 0) clocks = [defaultTimezone()];

    createClocks(clocks);
    const animateClocks = () => {
        clocks.forEach((clock, idx) => {
            clocks[idx] = updateClock(clock, interval);
        });

        requestAnimationFrame(animateClocks);
    };
    requestAnimationFrame(animateClocks);

    window.addEventListener('load', () => createClocks(clocks));
    window.addEventListener('resize', () => createClocks(clocks));
    window.addEventListener('touchstart' in window ? 'touchstart' : 'click', () => createClocks(clocks));
}

main();


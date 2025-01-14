/***
 * @fileoverview Main application file
 */

let clocks = [];

const COLOR_SCHEME = {
    background: 'white', 
    frame: 'black',
    markers: 'black',
    seconds: 'red', 
    minutes: 'black', 
    hours: 'black', 
};

function getLocationsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let locations = urlParams.get('locations');
    locations = locations ? locations.split(',').map(loc => {
        const idx = parseInt(loc);
        return isNaN(idx) ? loc :  DEFAULT_LOCATIONS[idx];
    }) : [];

    const single = urlParams.get('single') == "true";
    const interval = (parseInt(urlParams.get('interval')) || 1);

    return { locations, single, interval };
}

function createClockElement(idx, clockWidth) { 
    const cityNameFontSize = clockWidth / 17;
    const cityNameHeight = cityNameFontSize * 2;

    const clockWrapperID = `clockWrapper-${idx}`;
    let clockWrapper = document.getElementById(clockWrapperID);
    if (clockWrapper === null) {
        clockWrapper = document.createElement('div');
        clockWrapper.id = clockWrapperID;
        clockWrapper.className = 'clock-wrapper';
    }
    clockWrapper.style.width = `${clockWidth}px`;
    clockWrapper.style.height = `${clockWidth}px`;

    const canvasID = `canvas-${idx}`;  
    let canvas = document.getElementById(canvasID);
    if (canvas === null) {
        canvas = document.createElement('canvas');
        canvas.id = canvasID;
        canvas.className = 'clock';
        clockWrapper.appendChild(canvas);
    }
    canvas.width = clockWidth - cityNameHeight;
    canvas.height =  clockWidth - cityNameHeight;

    const cityNameID = `cityName-${idx}`;
    let cityName = document.getElementById(cityNameID);
    if (cityName === null) {
        cityName = document.createElement('div');
        cityName.id = cityNameID;
        clockWrapper.appendChild(cityName);
    }
    cityName.style.fontSize = `${cityNameFontSize}px`;

    let clock = clocks[idx];
    const analog = new AnalogClock(canvas, clock.timezone, COLOR_SCHEME);

    const displayClock = (clock) => { 
        analog.setNewTimezone(clock.timezone);
        analog.drawClock();

        cityName.className = `city-name-${analog.isPM() ? 'pm' : 'am'}`;
        cityName.textContent = `\u00A0\u00A0${clock.city} / ${clock.UTCOffset}\u00A0\u00A0`;
    }
    displayClock(clock);

    let tickMinutes = 0;
    let lastMinute = analog.getMinutes();
    clock.timerHandler = setInterval(() => {
        if (clock.random || clock.single) {
            const nowMinute = analog.getMinutes();
            if (lastMinute !== nowMinute) {
                lastMinute = nowMinute;
                tickMinutes ++
                if (tickMinutes >= clock.interval) {
                    tickMinutes = 0;

                    if (clock.single) {
                        clocks[idx] = clock = clocks[(clock.idx + 1) % clocks.length];
                    }
                    if (clock.random) {
                        clocks[idx] = clock = {... clock, ...randomTimezone()};
                    }
                }
            }    
        }

        displayClock(clock);
    }, 1000 / 60);

    return clockWrapper;
}

function createClocks() {
    const { locations, single, interval } = getLocationsFromUrl();
    clocks.forEach(clock => clearInterval(clock.timerHandler));
    clocks = locations.map(location => {
        const random = location === "?";
        const params = {random, interval, single};
        const timezone = random ? randomTimezone() : cityTimezone(location);
        return timezone ? {... params, ...timezone} : null;
    }).filter(Boolean);
    if (clocks.length === 0) clocks = [defaultTimezone()];
    clocks.map((clock, idx) => ({ ...clock, idx })) 

    const clockContainer = document.getElementById('clock-container');
    if (single) {
        const clockSize = Math.min(window.innerHeight, window.innerWidth);
        const clockWrapper = createClockElement(0, clockSize);
        clockContainer.appendChild(clockWrapper);
    }
    else {
        let clockSize = 0;
        if (window.innerWidth > window.innerHeight) {
            clockContainer.style.flexDirection = 'row';
            clockSize = (window.innerWidth - 20) / clocks.length;
            while (clockSize > window.innerHeight - 20) clockSize -= 1;
        }
        else {
            clockContainer.style.flexDirection = 'column';
            clockSize = (window.innerHeight - 20) / clocks.length;
            while (clockSize > window.innerWidth - 20) clockSize -= 1;
        }

        clocks.forEach((clock, idx) => {
            const clockWrapper = createClockElement(idx, clockSize);
            clockContainer.appendChild(clockWrapper);
        });
    }
}

function main() {
    window.addEventListener('load', createClocks);
    window.addEventListener('resize', createClocks);
    window.addEventListener('touchstart' in window ? 'touchstart' : 'click', createClocks);
}

/***
 * @fileoverview Main application file
 */

const COLOR_SCHEME = {
    background: 'white', 
    frame: 'black',
    markers: 'black',
    seconds: 'red', 
    minutes: 'black', 
    hours: 'black', 
};

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
};

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

    clock.analog.drawClock();

    clock.cityName.className = `city-name-${clock.analog.isPM() ? 'pm' : 'am'}`;
    clock.cityName.textContent = `\u00A0\u00A0${clock.city} / ${clock.UTCOffset}\u00A0\u00A0`;

    return clock;
};

function createClockElement(clock, idx, clockWidth) { 
    const cityNameFontSize = clockWidth / 17;
    const cityNameHeight = cityNameFontSize * 2;

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

    clock.cityName = clockWrapper.querySelector(`#cityName-${idx}`);
    clock.cityName.style.fontSize = `${cityNameFontSize}px`;

    const canvas = clockWrapper.querySelector(`#canvas-${idx}`);
    canvas.width = clockWidth - cityNameHeight;
    canvas.height = clockWidth - cityNameHeight;

    clock.analog = new AnalogClock(canvas, clock.timezone, COLOR_SCHEME);
    updateClock(clock, 0); 

    return clockWrapper;
}

function main() {
    const urlParams = new URLSearchParams(window.location.search);
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

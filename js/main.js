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

    const canvas = clockWrapper.querySelector(`#canvas-${idx}`);
    canvas.width = clockWidth - cityNameHeight;
    canvas.height = clockWidth - cityNameHeight;

    const cityName = clockWrapper.querySelector(`#cityName-${idx}`);
    cityName.style.fontSize = `${cityNameFontSize}px`;

    clock.analog = new AnalogClock(canvas, clock.timezone, COLOR_SCHEME);
    clock.analog.drawClock();
    clock.cityName = cityName;

    return clockWrapper;
}

function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const single = urlParams.get('single') === "true";
    const interval = parseInt(urlParams.get('interval')) || 1;
    const locations = (urlParams.get('locations') || '').split(',').map(loc => {
        const idx = parseInt(loc);
        return isNaN(idx) ? loc : DEFAULT_LOCATIONS[idx];
    }).filter(Boolean);

    let clocks = locations.map(location => {
        const random = location === "?";
        const timezone = random ? randomTimezone() : cityTimezone(location);
        return timezone ? {... {random, interval, single}, ...timezone} : null;
    }).filter(Boolean);
    if (clocks.length === 0) clocks = [defaultTimezone()];

    clocks.forEach((clock, idx) => {
        clock.idx = idx;
        clock.tickMinutes = 0;
        clock.lastMinute = 0;
    });

    const createClocks = () => {
        clocks.forEach(clock => clearInterval(clock.timerHandler));

        const clockContainer = document.getElementById('clock-container');
        if (single) {
            const clockSize = Math.min(window.innerHeight, window.innerWidth);
            const clockWrapper = createClockElement(clock, 0, clockSize);
            clockContainer.appendChild(clockWrapper);
        }
        else {
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
    };

    const updateClocks = () => {
        clocks.forEach((clock, idx) => {
            if (clock.random || clock.single) {
                const nowMinute = clock.analog.getMinutes();
                if (clock.lastMinute !== nowMinute) {
                    clock.lastMinute = nowMinute;
                    clock.tickMinutes ++
                    if (clock.tickMinutes >= clock.interval) {
                        clock.tickMinutes = 0;

                        if (clock.single) clocks[idx] = clock = clocks[(clock.idx + 1) % clocks.length];
                        if (clock.random) clocks[idx] = clock = {... clock, ...randomTimezone()};
                    }
                }
            }

            clock.analog.setTimezone(clock.timezone);
            clock.analog.drawClock();
    
            clock.cityName.className = `city-name-${clock.analog.isPM() ? 'pm' : 'am'}`;
            clock.cityName.textContent = `\u00A0\u00A0${clock.city} / ${clock.UTCOffset}\u00A0\u00A0`;
        });
    }

    createClocks();
    updateClocks();
    setInterval(updateClocks, 1000 / 60);

    window.addEventListener('load', createClocks);
    window.addEventListener('resize', createClocks);
    window.addEventListener('touchstart' in window ? 'touchstart' : 'click', createClocks);
}

/**
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jens@bennerhq.com> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   
 * ----------------------------------------------------------------------------
 */

import { TIMEZONES } from './tz_objects.js';

/**
 * Maps a location object to a timezone object.
 *
 * @param {Object} location - The location object.
 * @param {string} location.TZidentifier - The timezone identifier in the format "Region/City".
 * @param {string} location.UTCOffset - The UTC offset in the format "HH:MM".
 * @returns {Object} The mapped timezone object.
 * @returns {string} return.city - The city extracted from the TZidentifier.
 * @returns {string} return.region - The region extracted from the TZidentifier.
 * @returns {number} return.timezone - The timezone offset as a decimal number.
 * @returns {string} return.UTCOffset - The original UTC offset.
 * @returns {string} return.TZidentifier - The original timezone identifier.
 */
export function mapTimezone(location) {
    const TZidentifier = location.TZidentifier.split('/');
    const city = TZidentifier[TZidentifier.length - 1];
    const region = TZidentifier.length > 1 ? TZidentifier[0] : '';

    const UTCOffset = location.UTCOffset.split(':');
    const timezone = parseInt(UTCOffset[0]) + (parseInt(UTCOffset[1]) / 60);

    return {
        city,
        region,
        timezone,
        'UTCOffset': location.UTCOffset,
        'TZidentifier': location.TZidentifier,
    };
}

/**
 * Finds and returns timezones that match the given identifier.
 *
 * @param {string} tzIdentifier - The timezone identifier to search for. Spaces will be replaced 
 * with underscores and the identifier will be converted to lowercase.
 * @returns {Array<Object>} An array of timezone objects that match the given identifier.
 */
export function cityTimezone(tzIdentifier) {
    tzIdentifier = tzIdentifier.trim().toLowerCase();

    // Filter results based on partial or full match
    const result = TIMEZONES.filter(tz => tz.TZidentifier.includes(tzIdentifier));
    return result.length ? mapTimezone(result[0]) : null;
}

/**
 * Selects a random timezone from the TIMEZONES array and maps it to the provided object.
 *
 * @returns {Object} The object with the mapped timezone.
 */
export function randomTimezone() {
    const idx = Math.floor(Math.random() * TIMEZONES.length);

    return mapTimezone(TIMEZONES[idx]);
}

/**
 * Returns the default timezone object.
 *
 * @returns {Object} The default timezone object.
 * @returns {number} return.idx - The index of the timezone.
 * @returns {string} return.city - The city name of the timezone.
 * @returns {string} return.region - The region of the timezone.
 * @returns {number} return.timezone - The timezone offset in hours.
 * @returns {string} return.UTCOffset - The UTC offset in "+HH:MM" format.
 * @returns {string} return.TZidentifier - The timezone identifier.
 * @returns {boolean} return.single - Indicates if the timezone is a single entry.
 * @returns {boolean} return.random - Indicates if the timezone is randomly selected.
 */
export function defaultTimezone() {
    return mapTimezone({ 
        city: 'Europe/UTC', 
        UTCOffset: "+00:00",
        TZidentifier: 'UTC',
    });
}

/**
 * Removes duplicate timezones from the global TIMEZONES array, sorts them by their identifier,
 * and generates a downloadable JavaScript file containing the unique timezones.
 * 
 * The generated file includes a timestamp and a warning that it is auto-generated.
 * 
 * @function
 */
export function removeDuplicates() {
    const uniqueTimezones = [];
    const seen = new Set();

    TIMEZONES.forEach(tz => {
        if (!seen.has(tz.TZidentifier)) {
            seen.add(tz.TZidentifier);
            uniqueTimezones.push(tz);
        }
    });
    uniqueTimezones.sort((a, b) => a.TZidentifier.localeCompare(b.TZidentifier));

    const blob = new Blob(
        [
            `/***\n` +
            ` * This file is auto-generated on ${new Date().toISOString()}.\n` + 
            ` * Do not edit manually\n` +
            ` */\n` +
            `const TIMEZONES = ${JSON.stringify(uniqueTimezones, null, 2)};`
        ], 
        { type: 'application/javascript' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tz_objects.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

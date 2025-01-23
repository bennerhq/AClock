/**
 *	Sunrise/sunset script. By Matt Kane. 
 * 
 *  Based loosely and indirectly on Kevin Boone's SunTimes Java implementation 
 *  of the US Naval Observatory's algorithm.
 * 
 *  Copyright © 2012 Triggertrap Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General
 * Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful,but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 * You should have received a copy of the GNU Lesser General Public License along with this library; if not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA,
 * or connect to: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 */

export function sunrise(date, latitude, longitude, zenith) {
	return sunriseSet(date, latitude, longitude, true, zenith);
}

export function sunset(date, latitude, longitude, zenith) {
	return sunriseSet(date, latitude, longitude, false, zenith);
}

function sunriseSet(date, latitude, longitude, sunrise, zenith) {
	if (!zenith) {
		zenith = 90.8333;
	}

	var hoursFromMeridian = longitude / DEGREES_PER_HOUR,
		dayOfYear = getDayOfYear(date),
		approxTimeOfEventInDays,
		sunMeanAnomaly,
		sunTrueLongitude,
		ascension,
		rightAscension,
		lQuadrant,
		raQuadrant,
		sinDec,
		cosDec,
		cosLocalHourAngle,
		localHourAngle,
		localHour,
		localMeanTime,
		time;

	if (sunrise) {
		approxTimeOfEventInDays = dayOfYear + ((6 - hoursFromMeridian) / 24);
	} else {
		approxTimeOfEventInDays = dayOfYear + ((18.0 - hoursFromMeridian) / 24);
	}

	sunMeanAnomaly = (0.9856 * approxTimeOfEventInDays) - 3.289;

	sunTrueLongitude = sunMeanAnomaly + (1.916 * sinDeg(sunMeanAnomaly)) + (0.020 * sinDeg(2 * sunMeanAnomaly)) + 282.634;
	sunTrueLongitude = mod(sunTrueLongitude, 360);

	ascension = 0.91764 * tanDeg(sunTrueLongitude);
	rightAscension = 360 / (2 * Math.PI) * Math.atan(ascension);
	rightAscension = mod(rightAscension, 360);

	lQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
	raQuadrant = Math.floor(rightAscension / 90) * 90;
	rightAscension = rightAscension + (lQuadrant - raQuadrant);
	rightAscension /= DEGREES_PER_HOUR;

	sinDec = 0.39782 * sinDeg(sunTrueLongitude);
	cosDec = cosDeg(asinDeg(sinDec));
	cosLocalHourAngle = ((cosDeg(zenith)) - (sinDec * (sinDeg(latitude)))) / (cosDec * (cosDeg(latitude)));

	localHourAngle = acosDeg(cosLocalHourAngle);

	if (sunrise) {
		localHourAngle = 360 - localHourAngle;
	}

	localHour = localHourAngle / DEGREES_PER_HOUR;

	localMeanTime = localHour + rightAscension - (0.06571 * approxTimeOfEventInDays) - 6.622;

	time = localMeanTime - (longitude / DEGREES_PER_HOUR);
	time = mod(time, 24);

	var midnight = new Date(0);
	midnight.setUTCFullYear(date.getUTCFullYear());
	midnight.setUTCMonth(date.getUTCMonth());
	midnight.setUTCDate(date.getUTCDate());

	var milli = midnight.getTime() + (time * 60 * 60 * 1000);

	return new Date(milli);
}

const DEGREES_PER_HOUR = 360 / 24;

// Utility functions

function getDayOfYear(date) {
	var onejan = new Date(date.getFullYear(), 0, 1);
	return Math.ceil((date - onejan) / 86400000);
}

function degToRad(num) {
	return num * Math.PI / 180;
}

function radToDeg(radians) {
	return radians * 180.0 / Math.PI;
}

function sinDeg(deg) {
	return Math.sin(deg * 2.0 * Math.PI / 360.0);
}

function acosDeg(x) {
	return Math.acos(x) * 360.0 / (2 * Math.PI);
}

function asinDeg(x) {
	return Math.asin(x) * 360.0 / (2 * Math.PI);
}

function tanDeg(deg) {
	return Math.tan(deg * 2.0 * Math.PI / 360.0);
}

function cosDeg(deg) {
	return Math.cos(deg * 2.0 * Math.PI / 360.0);
}

function mod(a, b) {
	var result = a % b;
	if (result < 0) {
		result += b;
	}
	return result;
}

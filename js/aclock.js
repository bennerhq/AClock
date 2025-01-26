/**
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jens@bennerhq.com> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   
 * ----------------------------------------------------------------------------
 */

/**
 * Class representing an analog clock, rendered on a canvas element.
 */
export class AnalogClock {
    constructor(canvas, city, timezone, colorScheme) {
        this.canvas = canvas;
        this.city = city.toUpperCase();
        this.setTimezone(timezone);
        this.colorScheme = colorScheme;

        this.ctx = this.canvas.getContext('2d');
        this.radius = this.canvas.width / 2;
        this.ctx.translate(this.radius, this.radius);
    }

    setTimezone(timezone) {
        if (timezone !== undefined) {
            this.timezone = timezone;
        }

        const now = new Date();
        const utcOffset = now.getTimezoneOffset() * 60000;
        const timezoneOffset = this.timezone * 3600000;
        const localTime = now.getTime() + utcOffset + timezoneOffset;
        this.date = new Date(localTime);
    }

    setCity = (city) => this.city = city.toUpperCase();
    setColorScheme = (colorScheme) => this.colorScheme = colorScheme;

    getMinutes = () => this.date.getMinutes();
    getDate = () => this.date;

    drawFace() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colorScheme.background;
        this.ctx.fill();

        if (this.colorScheme.frame !== this.colorScheme.background) {
            this.ctx.strokeStyle = this.colorScheme.frame;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    drawHourMarkers() {
        this.ctx.lineWidth = this.radius * 0.01;
        this.ctx.strokeStyle = this.colorScheme.markers;
        for (let num = 1; num < 13; num++) {
            if (num === 3) continue; // Skip 15:00 position - day numbver is drawn here

            let ang = num * Math.PI / 6;
            this.ctx.save();
            this.ctx.rotate(ang);
            this.ctx.translate(0, -this.radius * 0.97);
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, this.radius * 0.1);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    drawHand(pos, length, width, color) {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(0, 0);
        this.ctx.rotate(pos);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();
        this.ctx.rotate(-pos);
    }

    drawText() {
        this.ctx.font = `${this.radius * 0.11}px Arial`;
        this.ctx.fillStyle = this.colorScheme.hours;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.city, 0, this.radius * 0.2);
    }

    drawDayNumber() {
        const day = this.date.getDate();
        this.ctx.save();
        this.ctx.rotate(Math.PI / 2); // Rotate to 15:00 position
        this.ctx.translate(0, -this.radius * 0.85); // Move to the edge of the clock face
        this.ctx.rotate(3 * Math.PI / 2); // Rotate back to original orientation
        this.ctx.font = `${this.radius * 0.15}px Arial`;
        this.ctx.fillStyle = this.colorScheme.hours;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText(day, 0, 0);
        this.ctx.restore();
    }

    drawTime() {
        this.setTimezone();

        const hour = this.date.getHours();
        const minute = this.date.getMinutes();
        const second = this.date.getSeconds();
        const millisecond = this.date.getMilliseconds();

        const hourPos = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        const minutePos = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        const secondPos = (second * Math.PI / 30) + (millisecond * Math.PI / (30 * 1000));

        this.drawHand(hourPos,   this.radius * 0.50, this.radius * 0.030, this.colorScheme.hours);
        this.drawHand(minutePos, this.radius * 0.80, this.radius * 0.030, this.colorScheme.minutes);
        this.drawHand(secondPos, this.radius * 0.96, this.radius * 0.005, this.colorScheme.seconds);
    }

    drawCenterCircle() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius * 0.05, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colorScheme.hours;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius * 0.02, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colorScheme.background;
        this.ctx.fill();
    }

    drawClock() {
        this.ctx.clearRect(-this.radius, -this.radius, this.canvas.width, this.canvas.height);

        this.drawFace();
        this.drawText();
        this.drawHourMarkers();
        this.drawDayNumber();
        this.drawTime();
        this.drawCenterCircle();
    }
}

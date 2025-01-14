/***
 * Class for drawing a analog clock on a canvas.
 */

class AnalogClock {
    constructor(canvas, timezone, colorScheme) {
        this.canvas = canvas;
        this.timezone = timezone;
        this.colorScheme = colorScheme;

        this.ctx = this.canvas.getContext('2d');
        this.radius = this.canvas.width / 2;
        this.ctx.translate(this.radius, this.radius);

        this.localTime = 0;
        this.date = 0;
    }

    drawFace() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius - 1, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colorScheme.background;
        this.ctx.fill();
        this.ctx.strokeStyle = this.colorScheme.frame;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.beginPath();
    }

    drawHourMarkers() {
        this.ctx.lineWidth = this.radius * 0.01;
        this.ctx.strokeStyle = this.colorScheme.markers;
        for (let num = 1; num < 13; num++) {
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

    drawTime() {
        const now = new Date();
        const utcOffset = now.getTimezoneOffset() * 60000;
        const timezoneOffset = this.timezone * 3600000;
        this.localTime = now.getTime() + utcOffset + timezoneOffset;
        this.date = new Date(this.localTime);

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
        this.ctx.arc(0, 0, this.radius * 0.03, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colorScheme.frame;  
        this.ctx.fill();
    }

    drawClock() {
        this.ctx.clearRect(-this.radius, -this.radius, this.canvas.width, this.canvas.height);

        this.drawFace();
        this.drawHourMarkers();
        this.drawTime();
        this.drawCenterCircle();
    }

    setNewTimezone(timezone) {
        this.timezone = timezone;
    }

    isPM() {
        return this.date.getHours() >= 12;
    }

    getMinutes() {
        return this.date.getMinutes();
    }
}

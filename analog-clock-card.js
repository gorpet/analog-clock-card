class AnalogClockCard extends Polymer.Element {
  
  static get template() {
    return Polymer.html`
      <style>
        .content {
          text-align: center;
        }
      </style>
      <ha-card>
        <div class="content">
          <canvas id="canvas" width="300" height="300"></canvas>
        </div>
      </ha-card>
     `
  }
  
  static get properties() {
    return {
      _hass: Object
    }
  }
  
  ready() {
    super.ready();
    this.canvas = this.$.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.radius = this.canvas.height / 2;
    this.ctx.translate(this.radius, this.radius);
    this.radius = this.radius * 0.90;
    this._drawClock();
    setInterval(() => this._drawClock(), 1000);
  }
  
  _drawClock() {
    this._drawFace(this.ctx, this.radius);
    this._drawNumbers(this.ctx, this.radius);
    this._drawTime(this.ctx, this.radius);
  }

  _drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2*Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, '#56a0ee');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
    ctx.fillStyle = '#333';
    var date = new Date();
    ctx.fillText(date.toLocaleDateString("hr-HR"), 5, -70);
    ctx.fill();
  }

  _drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.font = radius*0.15 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    for(num = 1; num < 13; num++){
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius*0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius*0.85);
      ctx.rotate(-ang);
    }
  }

  _drawTime(ctx, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    this._drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    this._drawHand(ctx, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    this._drawHand(ctx, second, radius*0.9, radius*0.02);
  }

  _drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }
  
  setConfig(config) {
    this.config = config;
  }
  
  set hass(hass) {
    this._hass = hass;
  }
  
  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('analog-clock-card', AnalogClockCard);

import "./App.css";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.c = 3;
    this.v = 1000;
    this.period = 1000;

    this.space = 30;
    this.spaceTransmitter = 20;

    this.prevX = 0;
    this.prevY = 0;

    this.Transmitter = {
      x: 0,
      y: 0,

      draw: function (ctx, x, y) {
        ctx.fillRect(x, y, 8, 8);
      },
    };

    this.receivers = [];

    this.CnvsRef = React.createRef();

    this.CnvsInit = this.CnvsInit.bind(this);
    this.getRandom = this.getRandom.bind(this);
    this.Calculate = this.Calculate.bind(this);
  }

  componentDidMount() {
    this.CnvsInit();
  }

  CnvsInit() {
    let cnvs = this.CnvsRef.current;
    let ctx = cnvs.getContext("2d");

    ctx.fillStyle = "Blue";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";

    /* инициализация радиоприемников */
    for (let i = 0; i < this.c; i++) {
      let x = this.getRandom(cnvs.width - this.space, this.space);
      let y = this.getRandom(cnvs.height - this.space, this.space);

      this.receivers[i] = {};

      this.receivers[i].x = x;
      this.receivers[i].y = y;
      this.receivers[i].draw = function (ctx, x, y) {
        ctx.fillRect(x, y, 15, 15);
      };

      this.receivers[i].draw(ctx, x, y);
    }

    /* инициализация радиопередатчика */
    ctx.fillStyle = "Orange";

    this.Transmitter.x = this.getRandom(
      cnvs.width - (this.space + this.spaceTransmitter),
      this.space + this.spaceTransmitter
    );
    this.Transmitter.y = this.getRandom(
      cnvs.height - (this.space + this.spaceTransmitter),
      this.space + this.spaceTransmitter
    );

    this.Calculate(ctx);

    // this.Transmitter.draw(ctx, this.Transmitter.x, this.Transmitter.y);

    // ctx.beginPath();
    // ctx.arc(50, 50, 50, 0, Math.PI * 2, false);
    // ctx.moveTo(50, 50);
    // ctx.fill();
    // ctx.closePath();
  }

  Calculate(ctx) {
    let cnvs = this.CnvsRef.current;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0, 0, 0, 0)";

    let recv = this.receivers;

    ctx.strokeStyle = "Red";
    ctx.fillStyle = "Black";

    setInterval(() => {

      let r = [];

      r[0] = (this.v * this.getRandom(9, 1)) / 100;
      r[1] = (this.v * this.getRandom(9, 1)) / 100;
      r[2] = (this.v * this.getRandom(9, 1)) / 100;

      let x =
        ((recv[1].y - recv[0].y) *
          (r[1] * r[1] -
            r[2] * r[2] -
            recv[1].y * recv[1].y +
            recv[2].y * recv[2].y -
            recv[1].x * recv[1].x +
            recv[2].x * recv[2].x) -
          (recv[2].y - recv[1].y) *
            (r[0] * r[0] -
              r[1] * r[1] -
              recv[0].y * recv[0].y +
              recv[1].y * recv[1].y -
              recv[0].x * recv[0].x +
              recv[1].x * recv[1].x)) /
        (2 *
          ((recv[2].y - recv[1].y) * (recv[0].x - recv[1].x) -
            (recv[1].y - recv[0].y) * (recv[1].x - recv[2].x)));

      let y =
        ((recv[1].x - recv[0].x) *
          (r[1] * r[1] -
            r[2] * r[2] -
            recv[1].x * recv[1].x +
            recv[2].x * recv[2].x -
            recv[1].y * recv[1].y +
            recv[2].y * recv[2].y) -
          (recv[2].x - recv[1].x) *
            (r[0] * r[0] -
              r[1] * r[1] -
              recv[0].x * recv[0].x +
              recv[1].x * recv[1].x -
              recv[0].y * recv[0].y +
              recv[1].y * recv[1].y)) /
        (2 *
          ((recv[2].x - recv[1].x) * (recv[0].y - recv[1].y) -
            (recv[1].x - recv[0].x) * (recv[1].y - recv[2].y)));

      // console.log(x, y);

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2, false);
      ctx.moveTo(x, y);
      ctx.fill();
      ctx.closePath();

      ctx.lineTo(this.prevX, this.prevY);
      ctx.stroke();

      this.prevX = x;
      this.prevY = y;

      this.Transmitter.x = this.getRandom(
        cnvs.width - (this.space + this.spaceTransmitter),
        this.space + this.spaceTransmitter
      );
      this.Transmitter.y = this.getRandom(
        cnvs.height - (this.space + this.spaceTransmitter),
        this.space + this.spaceTransmitter
      );
    }, this.period);
  }

  getRandom(max, min) {
    return Math.random() * (max - min) + min;
  }

  render() {
    return (
      <div>
        <canvas ref={this.CnvsRef}>Обновите браузер</canvas>
      </div>
    );
  }
}

export default App;

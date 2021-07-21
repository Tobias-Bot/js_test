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

      draw: function (ctx) {
        ctx.fillRect(this.x, this.y, 8, 8);
      },
    };

    this.receivers = [];
    this.times = [];

    this.CnvsRef = React.createRef();
    this.FileInRef = React.createRef();

    this.Draw = this.Draw.bind(this);
    this.getRandom = this.getRandom.bind(this);
    this.Calculate = this.Calculate.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  Draw() {
    let cnvs = this.CnvsRef.current;
    let ctx = cnvs.getContext("2d");

    /* инициализация радиопередатчика */
    this.Transmitter.x = this.getRandom(
      cnvs.width - (this.space + this.spaceTransmitter),
      this.space + this.spaceTransmitter
    );
    this.Transmitter.y = this.getRandom(
      cnvs.height - (this.space + this.spaceTransmitter),
      this.space + this.spaceTransmitter
    );

    ctx.fillStyle = "Blue";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "green";

    for (let i = 0; i < this.c; i++) {
      this.receivers[i].draw(ctx);
    }

    this.Calculate(ctx);
  }

  Calculate(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0, 0, 0, 0)";

    let recv = this.receivers;

    ctx.strokeStyle = "Red";
    ctx.fillStyle = "Black";

    let j = 0;

    let timer = setInterval(() => {
      let r = [];

      r[0] = this.v * this.times[j][0];
      r[1] = this.v * this.times[j][1];
      r[2] = this.v * this.times[j][2];

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

      console.log(x, y);

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2, false);
      ctx.moveTo(x, y);
      ctx.fill();
      ctx.closePath();

      if (!j) {
        ctx.lineTo(this.prevX, this.prevY);
        ctx.stroke();
      }

      this.prevX = x;
      this.prevY = y;

      j++;

      j === this.times.length && clearInterval(timer);
    }, this.period);
  }

  getRandom(max, min) {
    return Math.random() * (max - min) + min;
  }

  fileUpload() {
    let file = this.FileInRef.current.files[0];

    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
      let data = reader.result.split("\r\n");

      let recvsXY = data[0].split(",");

      let j = 0;
      for (let i = 0; i < this.c; i++) {
        this.receivers[i] = {};

        this.receivers[i].x = Number(recvsXY[j]);
        this.receivers[i].y = Number(recvsXY[j + 1]);
        this.receivers[i].draw = function (ctx) {
          ctx.fillRect(this.x, this.y, 5, 5);
        };

        j += 2;
      }

      for (let i = 1; i < data.length; i++) {
        this.times[i - 1] = data[i].split(",");
      }
    }.bind(this);

    reader.onerror = function () {
      console.log(reader.error);
    };
  }

  render() {
    return (
      <div>
        <canvas ref={this.CnvsRef}>Обновите браузер</canvas>
        <input type="file" ref={this.FileInRef} onChange={this.fileUpload} />
        <button onClick={this.Draw}>пуск</button>
      </div>
    );
  }
}

export default App;

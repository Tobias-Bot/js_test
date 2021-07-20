import "./App.css";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.c = 3;

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

    let space = 30;
    let spaceTransmitter = 20;

    /* инициализация радиоприемников */
    for (let i = 0; i < this.c; i++) {
      let x = this.getRandom(cnvs.width - space, space);
      let y = this.getRandom(cnvs.height - space, space);

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
      cnvs.width - (space + spaceTransmitter),
      space + spaceTransmitter
    );
    this.Transmitter.y = this.getRandom(
      cnvs.height - (space + spaceTransmitter),
      space + spaceTransmitter
    );

    this.Transmitter.draw(ctx, this.Transmitter.x, this.Transmitter.y);

    // ctx.beginPath();
    // ctx.arc(50, 50, 50, 0, Math.PI * 2, false);
    // ctx.moveTo(50, 50);
    // ctx.fill();
    // ctx.closePath();
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

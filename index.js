class FrameRateControl {
  constructor(options) {
    const dpr = window.devicePixelRatio;
    const defaultOptions = {
      background: 'rgba(0,0,0,0.9)',
      barWidth: 4 * dpr,
      color: '#7cf859',
      font: 'Monaco, Consolas, Courier, monospace',
      graphHeight: 60 * dpr,
      graphWidth: 90 * dpr,
      graphTop: 0,
      graphRight: 5 * dpr,
      width: 100 * dpr
    };

    this.frames = 0;
    this.totalTime = 0;
    this.totalFrames = 0;
    this.options = { ...options, ...defaultOptions };
  }

  onAdd = map => {
    this.map = map;

    const dpr = window.devicePixelRatio;
    const {
      width,
      graphWidth,
      graphHeight,
      color,
      background,
      font
    } = this.options;

    const el = (this.container = document.createElement('div'));
    el.className = 'mapboxgl-ctrl mapboxgl-ctrl-fps';

    el.style.backgroundColor = background;
    el.style.borderRadius = '6px';

    this.readOutput = document.createElement('div');
    this.readOutput.style.color = color;
    this.readOutput.style.fontFamily = font;
    this.readOutput.style.padding = '0 5px 5px';
    this.readOutput.style.fontSize = '9px';
    this.readOutput.style.fontWeight = 'bold';
    this.readOutput.textContent = 'Waiting…';

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mapboxgl-ctrl-canvas';
    this.canvas.width = width;
    this.canvas.height = graphHeight;
    this.canvas.style.cssText = `width: ${width /
      dpr}px; height: ${graphHeight / dpr}px;`;

    el.appendChild(this.readOutput);
    el.appendChild(this.canvas);

    this.map.on('movestart', this.onMoveStart);
    this.map.on('moveend', this.onMoveEnd);
    return this.container;
  };

  onMoveStart = () => {
    this.frames = 0;
    this.time = performance.now();
    this.map.on('render', this.onRender);
  };

  onMoveEnd = () => {
    const now = performance.now();
    this.updateGraph(this.getFPS(now));
    this.frames = 0;
    this.time = null;
    this.map.off('render', this.onRender);
  };

  onRender = () => {
    this.frames++;
    const now = performance.now();
    if (now >= this.time + 1e3) {
      this.updateGraph(this.getFPS(now));
      this.frames = 0;
      this.time = now;
    }
  };

  getFPS = now => {
    (this.totalTime += now - this.time), (this.totalFrames += this.frames);
    return Math.round((1e3 * this.frames) / (now - this.time)) || 0;
  };

  updateGraph = fpsNow => {
    const {
      barWidth,
      graphRight,
      graphTop,
      graphWidth,
      graphHeight,
      background,
      color
    } = this.options;

    const context = this.canvas.getContext('2d');
    const fps = Math.round((1e3 * this.totalFrames) / this.totalTime) || 0;
    const rect = (graphHeight, barWidth);

    context.fillStyle = background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, graphWidth, graphTop);
    context.fillStyle = color;

    this.readOutput.textContent = `${fpsNow} FPS (${fps} Avg)`;
    context.drawImage(
      this.canvas,
      graphRight + rect,
      graphTop,
      graphWidth - rect,
      graphHeight,
      graphRight,
      graphTop,
      graphWidth - rect,
      graphHeight
    );
    context.fillRect(
      graphRight + graphWidth - rect,
      graphTop,
      rect,
      graphHeight
    );
    context.fillStyle = background;
    context.globalAlpha = 0.75;
    context.fillRect(
      graphRight + graphWidth - rect,
      graphTop,
      rect,
      (1 - fpsNow / 100) * graphHeight
    );
  };

  onRemove = () => {
    this.map.off('render', this.onRender);
    this.map.off('movestart', this.onMoveStart);
    this.map.off('moveend', this.onMoveEnd);
    this.container.parentNode.removeChild(this.container);
    this.map = null;
    return this;
  };
}

if (window.mapboxgl) {
  mapboxgl.FrameRateControl = FrameRateControl;
}

export default FrameRateControl;

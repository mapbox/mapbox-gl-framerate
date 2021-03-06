mapbox-gl-framerate ([demo](https://labs.mapbox.com/mapbox-gl-framerate/))
---

A frame rate control to evaluate map rendering performance

### Usage

```js
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9'
});

const fps = new mapboxgl.FrameRateControl({ /* optional options */ });
map.addControl(fps);
```

### Options

| Property | Value | Description |
| ---- | ---- | ---- |
| background | <pre>rgba(0,0,0,0.9)</pre> | Color of the background container. |
| barWidth | <pre>4 * window.devicePixelRatio</pre> | Width of each individual performance bar. |
| color | <pre>#7cf859</pre> | Bar & text color. |
| font | <pre>'Monaco, Consolas, Courier, monospace'</pre> | Comma separated string of fonts for text. |
| graphHeight | <pre>60 * window.devicePixelRatio</pre> | Graph height. |
| graphWidth | <pre>90 * window.devicePixelRatio</pre> | Graph width. |
| graphTop | <pre>0</pre> | Top position of the graph. |
| graphRight | <pre>5 * window.devicePixelRatio</pre> | Right position of the graph. |
| width | <pre>100 * window.devicePixelRatio</pre> | Container width of the graph. |

### Running the demo

```sh
npm install & npm start & open http://localhost:1337/
```

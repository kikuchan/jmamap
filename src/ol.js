import { getLayerInfo, getLayerURL, fetchTargetTimes } from './index.js'

import { Vector as VectorLayer, Tile as TileLayer, VectorTile as VectorTileLayer } from 'ol/layer.js';
import { Vector as VectorSource, XYZ, VectorTile as VectorTileSource } from 'ol/source.js';
import { GeoJSON, MVT } from 'ol/format.js';
import { createCanvasContext2D } from 'ol/dom.js';

function s_curve(xmin, xmax, a = 2, xmid = -1) {
  xmid = xmid < 0 ? (xmax + xmin) / 2 : (xmid < xmin ? xmin : (xmax < xmid ? xmax : xmid));

  return [...Array(256)].map((_, x) => {
    if (x <= xmin) return 0;
    if (x <= xmid) return Math.pow((x- xmin)/(xmid-xmin), a)*255/(xmax-xmin)*(xmid-xmin);
    return (1-Math.pow(1 - (x - xmid)/(xmax - xmid),a))*(255 - (255/(xmax-xmin)*(xmid-xmin))) + (255/(xmax-xmin)*(xmid-xmin))
  });
}

export function JMALayer(layerId, opts = {}, sourceOpts = {}) {
  this._layerInfo = getLayerInfo(layerId);

  const constructorFor = {
    'geojson': VectorLayer,
    'png': TileLayer,
    'jpg': TileLayer,
    'pbf': VectorTileLayer,
  }

  Object.setPrototypeOf(this, constructorFor[this._layerInfo.format].prototype);

  // for cloud image processing
  const isCloud = opts.isCloud ?? ({
    'himawari/jp/visibleray': true,
    'himawari/jp/infrared':   true,
    'himawari/jp/steam':      true,
    'himawari/fd/visibleray': true,
    'himawari/fd/infrared':   true,
    'himawari/fd/steam':      true,
  }[layerId]) ?? false;

  const curveTbl = s_curve(64, 255, 4);
  const curveTbl2 = s_curve(0, 255, 8);

  function tileLoadFunction(tile, src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      const width = img.width;
      const height = img.height;

      const context = createCanvasContext2D(width, height);

      context.drawImage(img, 0, 0);
      const inputData = context.getImageData(0, 0, width, height).data;

      const output = context.createImageData(width, height);
      const outputData = output.data;

      // R -> Alpha
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          outputData[idx + 0] = curveTbl2[inputData[idx + 0]];
          outputData[idx + 1] = curveTbl2[inputData[idx + 1]];
          outputData[idx + 2] = curveTbl2[inputData[idx + 2]];
          outputData[idx + 3] = curveTbl[inputData[idx + 0]]; // R
        }
      }

      context.putImageData(output, 0, 0);

      (tile.getImage()).src = context.canvas.toDataURL();
    }
    img.src = src;
  }
  // ----------

  this.setTargetTime = function (targetTime) {
    if (!targetTime) {
      this.setSource(null);
      return ;
    }

    const url = getLayerURL(layerId, targetTime);
    if (!url) return ;

    switch (this._layerInfo.format) {
    case 'geojson':
      this.setSource(new VectorSource({
        ... sourceOpts,
        url,
        attributions: this._layerInfo.attributions,
        attributionsCollapsible: false,
        format: new GeoJSON(),
      }));
      break;

    case 'jpg':
    case 'png':
      this.setSource(new XYZ({
        interpolate: this._layerInfo.format == 'jpg',
        ... sourceOpts,
        url,
        attributions: this._layerInfo.attributions,
        attributionsCollapsible: false,

        zoomLevels: this._layerInfo.zoomLevels,
        minZoom   : this._layerInfo.minZoom,
        maxZoom   : this._layerInfo.maxZoom,

        tileLoadFunction: isCloud ? tileLoadFunction : undefined,
      }));
      break;

    case 'pbf':
      this.setSource(new VectorTileSource({
        ... sourceOpts,
        url,
        attributions: this._layerInfo.attributions,
        attributionsCollapsible: false,
        format: new MVT(),
      }));
      break;
    }
  }

  // super
  constructorFor[this._layerInfo.format].call(this, { ... opts });

  fetchTargetTimes(layerId).then(r => r.find(x => x.tense === 'latest')).then(t => this.setTargetTime(t));
}

export default {
  JMALayer
}

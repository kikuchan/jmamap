import type { LayerName, TargetTime } from '..';
import { fetchTargetTimes, getLayerInfo, getLayerURL } from '..';

import ImageTile from 'ol/ImageTile';
import type Tile from 'ol/Tile';
import { createCanvasContext2D } from 'ol/dom.js';
import { Tile as TileLayer } from 'ol/layer.js';
import type { Options as TileLayerOptions } from 'ol/layer/BaseTile.js';
import { XYZ } from 'ol/source.js';
import type { Options as SourceOptions } from 'ol/source/XYZ.js';

function s_curve(xmin: number, xmax: number, a = 2, xmid = -1) {
  xmid = xmid < 0 ? (xmax + xmin) / 2 : xmid < xmin ? xmin : xmax < xmid ? xmax : xmid;

  return [...Array(256)].map((_, x) => {
    if (x <= xmin) return 0;
    if (x <= xmid) return ((Math.pow((x - xmin) / (xmid - xmin), a) * 255) / (xmax - xmin)) * (xmid - xmin);
    return (
      (1 - Math.pow(1 - (x - xmid) / (xmax - xmid), a)) * (255 - (255 / (xmax - xmin)) * (xmid - xmin)) +
      (255 / (xmax - xmin)) * (xmid - xmin)
    );
  });
}

const curveTbl = s_curve(64, 255, 4);
const curveTbl2 = s_curve(0, 255, 8);

function tileLoadFunction(tile: Tile, src: string) {
  if (!(tile instanceof ImageTile)) return false;

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

    (tile.getImage() as HTMLImageElement).src = context.canvas.toDataURL();
  };
  img.src = src;
}

type Tense = 'latest' | 'past' | 'forecast';
export type LayerOptions = {
  isCloud?: boolean;
} & TileLayerOptions<XYZ>;
export type { Options as SourceOptions } from 'ol/source/XYZ';

export class JMATileLayer extends TileLayer<XYZ> {
  sourceOpts: SourceOptions;
  isCloud: boolean;
  layerInfo: ReturnType<typeof getLayerInfo>;

  constructor(layerId: LayerName, opts: LayerOptions = {}, sourceOpts: SourceOptions = {}) {
    super(opts);

    this.layerInfo = getLayerInfo(layerId);
    if (!this.layerInfo) throw new Error('Unknown layer');

    this.isCloud = opts.isCloud ?? this.layerInfo.isCloud ?? false;

    this.sourceOpts = sourceOpts;

    this.reload();
  }

  reload() {
    fetchTargetTimes(this.layerInfo.id)
      .then((r) => r.find((x) => x.tense === 'latest') || r.find((x) => x.tense == 'forecast'))
      .then((t) => this.setTargetTime(t));
  }

  setTargetTime(targetTime: TargetTime | undefined | null) {
    if (!targetTime) {
      this.setSource(null);
      return;
    }

    const url = getLayerURL(this.layerInfo.id, targetTime);
    if (!url) return;

    // assert(this.layerInfo.format === 'jpg' || this.layerInfo.format === 'png', 'Invalid format');

    this.setSource(
      new XYZ({
        interpolate: this.layerInfo.format === 'jpg',
        ...this.sourceOpts,
        url,
        attributions: this.layerInfo.attributions,
        attributionsCollapsible: false,

        minZoom: this.layerInfo.minZoom,
        maxZoom: this.layerInfo.maxZoom,

        tileLoadFunction: this.isCloud ? tileLoadFunction : undefined,
      }),
    );
  }
}

import type { LayerName, TargetTime } from '..';
import { fetchTargetTimes, getLayerInfo, getLayerURL } from '..';

import { MVT } from 'ol/format.js';
import { VectorTile as VectorTileLayer } from 'ol/layer.js';
import type { Options as LayerOptions } from 'ol/layer/VectorTile.js';
import { VectorTile as VectorTileSource } from 'ol/source.js';
import type { Options as SourceOptions } from 'ol/source/VectorTile.js';

export type { Options as LayerOptions } from 'ol/layer/VectorTile.js';
export type { Options as SourceOptions } from 'ol/source/VectorTile.js';

export class JMAVectorTileLayer extends VectorTileLayer {
  sourceOpts: SourceOptions;
  layerInfo: ReturnType<typeof getLayerInfo>;

  constructor(layerId: LayerName, opts: LayerOptions = {}, sourceOpts: SourceOptions = {}) {
    super(opts);

    this.layerInfo = getLayerInfo(layerId);
    if (!this.layerInfo) throw new Error('Unknown layer');

    this.sourceOpts = sourceOpts;

  }

  reload() {
    fetchTargetTimes(this.layerInfo.id)
      .then((r) => r.find((x) => x.tense === 'latest'))
      .then((t) => this.setTargetTime(t));
  }

  setTargetTime(targetTime: TargetTime | undefined | null) {
    if (!targetTime) {
      this.setSource(null);
      return;
    }

    const url = getLayerURL(this.layerInfo.id, targetTime);
    if (!url) return;

    // assert(this.layerInfo.format === 'pbf', 'Invalid format');

    this.setSource(
      new VectorTileSource({
        ...this.sourceOpts,
        url,
        attributions: this.layerInfo.attributions,
        attributionsCollapsible: false,
        format: new MVT(),
      }),
    );
  }
}

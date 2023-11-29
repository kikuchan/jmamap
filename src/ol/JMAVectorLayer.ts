import type { LayerName, TargetTime } from '..';
import { fetchTargetTimes, getLayerInfo, getLayerURL } from '..';

import type Feature from 'ol/Feature.js';
import { GeoJSON } from 'ol/format.js';
import type { Geometry } from 'ol/geom.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import type { Options as VectorLayerOptions } from 'ol/layer/BaseVector.js';
import { Vector as VectorSource } from 'ol/source.js';
import type { Options as SourceOptions } from 'ol/source/Vector.js';

export type LayerOptions = VectorLayerOptions<VectorSource>;
export type { Options as SourceOptions } from 'ol/source/Vector.js';

export class JMAVectorLayer extends VectorLayer<VectorSource<Feature<Geometry>>> {
  sourceOpts: SourceOptions;
  layerInfo: ReturnType<typeof getLayerInfo>;

  constructor(layerId: LayerName, opts: LayerOptions = {}, sourceOpts: SourceOptions = {}) {
    super(opts);

    this.layerInfo = getLayerInfo(layerId);
    if (!this.layerInfo) throw new Error('Unknown layer');

    this.sourceOpts = sourceOpts;

    this.reload();
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

    // assert(this.layerInfo.format === 'geojson', 'Invalid format');

    this.setSource(
      new VectorSource({
        ...this.sourceOpts,
        url,
        attributions: this.layerInfo.attributions,
        format: new GeoJSON(),
      }),
    );
  }
}

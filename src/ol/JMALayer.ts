import type { LayerName, LayerType } from '..';
import { getLayerInfo } from '..';

import type { Layer } from 'ol/layer';

import {
  JMATileLayer,
  type LayerOptions as JMATileLayerOptions,
  type SourceOptions as JMATileSourceOptions,
} from './JMATileLayer';
import {
  JMAVectorLayer,
  type LayerOptions as JMAVectorLayerOptions,
  type SourceOptions as JMAVectorSourceOptions,
} from './JMAVectorLayer';
import {
  JMAVectorTileLayer,
  type LayerOptions as JMAVectorTileLayerOptions,
  type SourceOptions as JMAVectorTileSourceOptions,
} from './JMAVectorTileLayer';

export type LayerOptionsFor<T extends LayerName> = LayerType<T> extends 'tile'
  ? JMATileLayerOptions
  : LayerType<T> extends 'vector-tile'
    ? JMAVectorTileLayerOptions
    : JMAVectorLayerOptions; // vector

export type SourceOptionsFor<T extends LayerName> = LayerType<T> extends 'tile'
  ? JMATileSourceOptions
  : LayerType<T> extends 'vector-tile'
    ? JMAVectorTileSourceOptions
    : JMAVectorSourceOptions; // vector

export type ConstructorFor<T extends LayerName> = LayerType<T> extends 'tile'
  ? JMATileLayer
  : LayerType<T> extends 'vector-tile'
    ? JMAVectorTileLayer
    : JMAVectorLayer;

export const JMALayer = function <T extends LayerName>(
  this: Layer,
  layerId: T,
  opts: LayerOptionsFor<T> = {},
  sourceOpts: SourceOptionsFor<T> = {},
) {
  const layerInfo = getLayerInfo(layerId);
  if (!layerInfo) throw new Error('Unknown layer');

  switch (layerInfo.layerType) {
    case 'tile':
      return new JMATileLayer(layerId, opts as JMATileLayerOptions, sourceOpts as JMATileSourceOptions);
    case 'vector':
      return new JMAVectorLayer(layerId, opts as JMAVectorLayerOptions, sourceOpts as JMAVectorSourceOptions);
    case 'vector-tile':
      return new JMAVectorTileLayer(
        layerId,
        opts as JMAVectorTileLayerOptions,
        sourceOpts as JMAVectorTileSourceOptions,
      );
  }
} as unknown as {
  new <T extends LayerName>(layerId: T, opts?: LayerOptionsFor<T>, sourceOpts?: SourceOptionsFor<T>): ConstructorFor<T>;
};

export default {
  JMALayer,
};

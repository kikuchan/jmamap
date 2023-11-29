import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

import { JMALayer } from 'jmamap/ol';

import {useGeographic} from 'ol/proj';

useGeographic();

new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),

    new JMALayer('himawari/fd/infrared'),
    new JMALayer('raincloud'),
    new JMALayer('linear-rainfall'),
    new JMALayer('raincloud-nodata'),
  ],
  target: 'map',
  view: new View({
    center: [135, 35],
    zoom: 6,
  }),
});


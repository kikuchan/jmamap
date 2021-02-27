const fetch = (typeof window !== 'undefined' && window.fetch) || require('node-fetch'); // XXX:

const JMA_DATA_URL_BASE  = 'https://www.jma.go.jp/bosai/{lv1}/data/{lv2}/';
const JMA_LAYER_URL_BASE = 'https://www.jma.go.jp/bosai/{lv1}/data/{lv2}/{basetime}/{member}/{validtime}/{lv3}/';

const defaultPathKeys = {
  lv1: 'jmatile',
  ext: 'png',
};

const jmaLayerInfo = {
  // 基本地図
  'base':  { layerUrl: 'https://www.jma.go.jp/tile/jma/base/{z}/{x}/{y}.png', category: '', name: 'base', targetTimesFile: false, zoomLevelRange: [3, 11] },
  'pale':  { layerUrl: 'https://www.jma.go.jp/tile/gsi/pale/{z}/{x}/{y}.png', category: '', name: 'pale', targetTimesFile: false, zoomLevelRange: [2, 14] },
  'pale2': { layerUrl: 'https://www.jma.go.jp/tile/gsi/pale2/{z}/{x}/{y}.png', category: '', name: 'pale2', targetTimesFile: false, zoomLevelRange: [2, 14] },
  'green': { layerUrl: 'https://www.jma.go.jp/tile/jma/green-cities/{z}/{x}/{y}.png', category: '', name: 'green', targetTimesFile: false, zoomLevelRange: [3, 10] },
  'mask':  { pathKeys: { lv2: 'map', lv3: 'surf/mask' }, category: '', name: 'mask', targetTimesFile: false, zoomLevelRange: [3, 14] },
  'river': { pathKeys: { lv2: 'map', lv3: 'surf/flood' }, category: '', name: '河川', targetTimesFile: false, zoomLevelRange: [8, 14] },

  // ひまわり
  'visibleray/jp':  { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'B03/ALBD', ext: 'jpg' }, category: 'ひまわり', name: '可視画像（日本域）'              , zoomLevelRange: [3, 6], targetTimesFile: 'targetTimes_jp.json' },
  'infrared/jp':    { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'B13/TBB',  ext: 'jpg' }, category: 'ひまわり', name: '赤外画像（日本域）'              , zoomLevelRange: [3, 6], targetTimesFile: 'targetTimes_jp.json' },
  'steam/jp':       { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'B08/TBB',  ext: 'jpg' }, category: 'ひまわり', name: '水蒸気画像（日本域）'            , zoomLevelRange: [3, 6], targetTimesFile: 'targetTimes_jp.json' },
  'truecolor/jp':   { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'REP/ETC',  ext: 'jpg' }, category: 'ひまわり', name: 'トゥルーカラー再現画像（日本域）', zoomLevelRange: [3, 6], targetTimesFile: 'targetTimes_jp.json' },
  'cloudtop/jp':    { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'SND/ETC',  ext: 'jpg' }, category: 'ひまわり', name: '雲頂強調画像（日本域）'          , zoomLevelRange: [3, 6], targetTimesFile: 'targetTimes_jp.json' },
  'visibleray/fd':  { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'B03/ALBD', ext: 'jpg' }, category: 'ひまわり', name: '可視画像（全球）'              , zoomLevelRange: [3, 5], targetTimesFile: 'targetTimes_fd.json' },
  'infrared/fd':    { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'B13/TBB',  ext: 'jpg' }, category: 'ひまわり', name: '赤外画像（全球）'              , zoomLevelRange: [3, 5], targetTimesFile: 'targetTimes_fd.json' },
  'steam/fd':       { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'B08/TBB',  ext: 'jpg' }, category: 'ひまわり', name: '水蒸気画像（全球）'            , zoomLevelRange: [3, 5], targetTimesFile: 'targetTimes_fd.json' },
  'truecolor/fd':   { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'REP/ETC',  ext: 'jpg' }, category: 'ひまわり', name: 'トゥルーカラー再現画像（全球）', zoomLevelRange: [3, 5], targetTimesFile: 'targetTimes_fd.json' },
  'cloudtop/fd':    { pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'SND/ETC',  ext: 'jpg' }, category: 'ひまわり', name: '雲頂強調画像（全球）'          , zoomLevelRange: [3, 5], targetTimesFile: 'targetTimes_fd.json' },

  // 雨雲の動き
  'raincloud':        { pathKeys: { lv2: 'nowc', lv3: 'surf/hrpns'        }, category: '雨雲の動き', name: '雨雲の動き（高解像度降水ナウキャスト）',   zoomLevelRange: [3, 10], targetTimesFile: ['targetTimes_N1.json', 'targetTimes_N2.json'], targetTimesElement: 'hrpns' },
  'thunder':          { pathKeys: { lv2: 'nowc', lv3: 'surf/thns'         }, category: '雨雲の動き', name: '雷活動度（雷ナウキャスト）',               zoomLevelRange: [3,  9],  targetTimesFile: 'targetTimes_N3.json', targetTimesElement: 'thns' },
  'tornado':          { pathKeys: { lv2: 'nowc', lv3: 'surf/trns'         }, category: '雨雲の動き', name: '竜巻発生確度（竜巻発生確度ナウキャスト）', zoomLevelRange: [3, 10], targetTimesFile: 'targetTimes_N3.json', targetTimesElement: 'trns' }, // XXX: zoomLevels 不明
  'amds_rain10m':     { type: 'geojson', pathKeys: { lv2: 'nowc', lv3: 'surf/amds_rain10m' }, category: '雨雲の動き', name: 'アメダス１０分間雨量'                                     , targetTimesFile: 'targetTimes_N3.json', targetTimesElement: 'amds_rain10m' },
  'liden':            { type: 'geojson', pathKeys: { lv2: 'nowc', lv3: 'surf/liden'        }, category: '雨雲の動き', name: '前５分間の雷の状況'                                       , targetTimesFile: 'targetTimes_N3.json', targetTimesElement: 'liden' },
  'raincloud-nodata': { type: 'geojson', pathKeys: { lv2: 'nowc', lv3: 'surf/hrpns_nd'     }, category: '雨雲の動き', name: '観測範囲外領域 [雨雲の動き（高解像度降水ナウキャスト）]'  , targetTimesFile: ['targetTimes_N1.json', 'targetTimes_N2.json'], targetTimesElement: 'hrpns_nd' },
  'liden-nodata':     { type: 'geojson', pathKeys: { lv2: 'nowc', lv3: 'surf/thns_nd'      }, category: '雨雲の動き', name: '観測範囲外領域 [雷活動度（雷ナウキャスト）]'              , targetTimesFile: 'targetTimes_N3.json', targetTimesElement: 'thns_nd' },
  'tornado-nodata':   { type: 'geojson', pathKeys: { lv2: 'nowc', lv3: 'surf/trns_nd'      }, category: '雨雲の動き', name: '観測範囲外領域 [竜巻発生確度（竜巻発生確度ナウキャスト）]', targetTimesFile: 'targetTimes_N3.json', targetTimesElement: 'trns_nd' },

  // 今後の雨
  'rainfall-1h':    { pathKeys: { lv2: 'rasrf', lv3: 'surf/rasrf'    }, category: '今後の雨', name: '1時間降水量',  zoomLevelRange: [3, 10], targetTimesElement: 'rasrf' },
  'rainfall-3h':    { pathKeys: { lv2: 'rasrf', lv3: 'surf/rasrf03h' }, category: '今後の雨', name: '3時間降水量',  zoomLevelRange: [3, 10], targetTimesElement: 'rasrf03h' },
  'rainfall-24h':   { pathKeys: { lv2: 'rasrf', lv3: 'surf/rasrf24h' }, category: '今後の雨', name: '24時間降水量', zoomLevelRange: [3, 10], targetTimesElement: 'rasrf24h' },

  // 天気予報分布
  'weather':     { pathKeys: { lv2: 'wdist', lv3: 'surf/wm'       }, category: '天気予報分布', name: '天気', targetTimesElement: 'wm', zoomLevelRange: [3, 10] },
  'temperature': { pathKeys: { lv2: 'wdist', lv3: 'surf/temp'     }, category: '天気予報分布', name: '気温', targetTimesElement: 'temp', zoomLevelRange: [3, 10] },
  'r3':          { pathKeys: { lv2: 'wdist', lv3: 'surf/r3'       }, category: '天気予報分布', name: '3時間降水量', targetTimesElement: 'r3', zoomLevelRange: [3, 10] }, // XXX: （basetime, validtime のペアを）同時刻にしても絵が 'rasrf' と合わない...
  's3':          { pathKeys: { lv2: 'wdist', lv3: 'surf/s3'       }, category: '天気予報分布', name: '3時間降雪量', targetTimesElement: 's3', zoomLevelRange: [3, 10] }, // XXX:  'snowf03h' で↑と同様？ 未検証
  'max_temp':    { pathKeys: { lv2: 'wdist', lv3: 'surf/max_temp' }, category: '天気予報分布', name: '日中の最高気温', targetTimesElement: 'max_temp', zoomLevelRange: [3, 10] },
  'min_temp':    { pathKeys: { lv2: 'wdist', lv3: 'surf/min_temp' }, category: '天気予報分布', name: '朝の最低気温', targetTimesElement: 'min_temp', zoomLevelRange: [3, 10] },

  // 現在の雪
  'snow':         { pathKeys: { lv2: 'snow', lv3: 'surf/snowd'    }, category: '現在の雪', name: '積雪の深さ',   zoomLevelRange: [3, 11] },
  'snowfall-3h':  { pathKeys: { lv2: 'snow', lv3: 'surf/snowf03h' }, category: '現在の雪', name: '3時間降雪量',  zoomLevelRange: [3, 11] },
  'snowfall-6h':  { pathKeys: { lv2: 'snow', lv3: 'surf/snowf06h' }, category: '現在の雪', name: '6時間降雪量',  zoomLevelRange: [3, 11] },
  'snowfall-12h': { pathKeys: { lv2: 'snow', lv3: 'surf/snowf12h' }, category: '現在の雪', name: '12時間降雪量', zoomLevelRange: [3, 11] },
  'snowfall-24h': { pathKeys: { lv2: 'snow', lv3: 'surf/snowf24h' }, category: '現在の雪', name: '24時間降雪量', zoomLevelRange: [3, 11] },
  'snowfall-48h': { pathKeys: { lv2: 'snow', lv3: 'surf/snowf48h' }, category: '現在の雪', name: '48時間降雪量', zoomLevelRange: [3, 11] },
  'snowfall-72h': { pathKeys: { lv2: 'snow', lv3: 'surf/snowf72h' }, category: '現在の雪', name: '72時間降雪量', zoomLevelRange: [3, 11] },

  // 海上分布予報
  'ws':    { pathKeys: { lv2: 'umimesh', lv3: 'surf/ws'    }, category: '海上分布予報', name: '風速'      , zoomLevelRange: [3, 8] },
  'wavh':  { pathKeys: { lv2: 'umimesh', lv3: 'surf/wavh'  }, category: '海上分布予報', name: '波の高さ'  , zoomLevelRange: [3, 8] },
  'vis':   { pathKeys: { lv2: 'umimesh', lv3: 'surf/vis'   }, category: '海上分布予報', name: '視程'      , zoomLevelRange: [3, 8] },
  'icing': { pathKeys: { lv2: 'umimesh', lv3: 'surf/icing' }, category: '海上分布予報', name: '着氷の程度', zoomLevelRange: [3, 8] },

  // 危険度分布
  'shinsui1': { layerUrl: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_oldlegend/{z}/{x}/{y}.png', category: '危険度分布', name: '洪水浸水想定区域（計画規模）', targetTimesFile: false, zoomLevelRange: [2, 16] },
  'shinsui2': { layerUrl: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/{z}/{x}/{y}.png', category: '危険度分布', name: '洪水浸水想定区域（想定最大規模）', targetTimesFile: false, zoomLevelRange: [2, 12] },
}

const _minZoomLevel = 1;
const _maxZoomLevel = 24;
let _lastTimeForCache = null;
let _targetTimeCache = {};

function utcToDate(utcYmdHM) {
  const Y = utcYmdHM.substr(0, 4);
  const m = utcYmdHM.substr(4, 2);
  const d = utcYmdHM.substr(6, 2);
  const H = utcYmdHM.substr(8, 2);
  const M = utcYmdHM.substr(10, 2);

  return new Date(Date.UTC(+Y, m - 1, +d, +H, +M));
}

function parseJSON(s) {
  try {
    return JSON.parse(s);
  } catch (e) {
    console.error(s);
    throw e;
  }
}

function isStaticLayer(layerId) {
  const info = jmaLayerInfo[layerId];
  if (!info) return null;

  return info.targetTimesFile === false || info.targetTimesFile === null;
}

async function fetchTargetTimes(layerId) {
  const info = jmaLayerInfo[layerId];
  if (!info) return null;

  if (isStaticLayer(layerId)) return null;

  const timeForCache = new Date().toJSON().substr(0, 16).replace(/[^0-9]/g, ''); // 1分単位
  if (timeForCache !== _lastTimeForCache) {
    _targetTimeCache = {};
    _lastTimeForCache = timeForCache;
  }

  const files = Array.isArray(info.targetTimesFile) ? info.targetTimesFile : [info.targetTimesFile || 'targetTimes.json'];
  const targetTimes = await Promise.all(files.map(file => {
    const url = rewriteURL(JMA_DATA_URL_BASE + file + '?_=' + timeForCache, { ...defaultPathKeys, ...info.pathKeys });

    if (_targetTimeCache[url]) return _targetTimeCache[url].then(s => parseJSON(s));

    return (_targetTimeCache[url] = fetch(url).then(res => res.text())).then(s => parseJSON(s));
  }))
    .then(values => Array.prototype.concat.apply([], values))
    .then(json => info.targetTimesElement ? json.filter(e => e.elements && e.elements.indexOf(info.targetTimesElement) >= 0) : json)
  ;

  targetTimes.sort((l, r) => (l.basetime === r.basetime ? l.validtime < r.validtime : l.basetime < r.basetime) ? -1 : 1);

  let latestBaseTime = null;
  targetTimes.forEach(json => {
    json.tense = json.basetime < json.validtime ? 'forecast' : 'past';
    if (!latestBaseTime || latestBaseTime < json.basetime) latestBaseTime = json.basetime;

    json.layerInfo = getLayerInfo(layerId, json);

    if (json.basetime) json.basetimeInDate = utcToDate(json.basetime);
    if (json.validtime) json.validtimeInDate = utcToDate(json.validtime);
  });
  
  // set latest
  let latest = targetTimes.find(json => json.basetime === latestBaseTime && json.basetime === json.validtime);
  if (latest) latest.tense = 'latest';

  return targetTimes;
}

function getLayerInfo(layerId, targetTimes = null) {
  const info = jmaLayerInfo[layerId];
  if (!info) return null;

  const result = {
    name: info.name || layerId,
    category: info.category || '',

    requireTargetTimes: !isStaticLayer(layerId),

    layerType: info.type || 'tile',

    attributions: '気象データ &copy; Japan Meteorological Agency',
  }

  result.url = getLayerURL(layerId, targetTimes);

  if (!info.type || info.type === 'tile') {
    const minZoomLevel = info.zoomLevelRange && info.zoomLevelRange[0] || _minZoomLevel;
    const maxZoomLevel = info.zoomLevelRange && info.zoomLevelRange[1] || _maxZoomLevel;
    result.zoomLevels = info.zoomLevels || new Array(maxZoomLevel - minZoomLevel + 1).fill(0).map((x, i) => i + minZoomLevel);
    result.minZoom = Math.max(Math.min.apply(Math, result.zoomLevels), _minZoomLevel);
    result.maxZoom = Math.min(Math.max.apply(Math, result.zoomLevels), _maxZoomLevel);
  }

  return result;
}

function rewriteURL(url, template) {
  if (!template) return url;
  return template ? url.replace(/{([a-zA-Z0-9]+)}/g, (match, p1) => typeof template[p1] === 'string' || typeof template[p1] === 'number' ? String(template[p1]) : `{${p1}}`) : url;
}

function getLayerURL(layerId, targetTime, template = null) {
  const info = jmaLayerInfo[layerId];
  if (!info) return null;

  const appendPath = !info.type || info.type === 'tile' ? '{z}/{x}/{y}.{ext}' : 'data.geojson';

  const layerUrl = info.layerUrl || (JMA_LAYER_URL_BASE + appendPath);

  return rewriteURL(layerUrl, {
    ... isStaticLayer(layerId) || targetTime ? { basetime: 'none', member: 'none', validtime: 'none' } : {}, // replace only if there are no targetTimes files
    ... defaultPathKeys,
    ... (targetTime || {}),
    ... (info.pathKeys || {}),
    ... (template || {}),
  });
}

export {
  fetchTargetTimes,
  getLayerURL,
  getLayerInfo,
}

# JMA MAP Loader

## What is it?

気象庁の地図データを取得するヘルパーライブラリです。

## 使い方

```
import { fetchTargetTimes } from './jmamap';

const targetTimes = await fetchTargetTimes('raincloud');
const latest = targetTimes.find(x => x.tense === 'latest');
```

とすると

```
{
  basetime: '20210227101000',
  validtime: '20210227101000',
  elements: [ 'hrpns', 'hrpns_nd' ],
  tense: 'latest',
  layerInfo: {
    name: '雨雲の動き（高解像度降水ナウキャスト）',
    category: '雨雲の動き',
    requireTargetTimes: true,
    layerType: 'tile',
    attributions: '気象データ &copy; Japan Meteorological Agency',
    url: 'https://www.jma.go.jp/bosai/jmatile/data/nowc/20210227101000/none/20210227101000/surf/hrpns/{z}/{x}/{y}.png',
    zoomLevels: [
      3, 4, 5,  6,
      7, 8, 9, 10
    ],
    minZoom: 3,
    maxZoom: 10
  },
  basetimeInDate: 2021-02-27T10:10:00.000Z,
  validtimeInDate: 2021-02-27T10:10:00.000Z
}
```
のような出力が得られます。
（`targetTimes` は取得できたものを多少加工して、さらに `basetime`, `validtime` 順に並べかえています）

`url` の部分をそのままコピーして、例えば地理院地図の「ツール → その他 → 外部タイル」で貼り付けると、ロードできます。


また、OpenLayers だったらそのまま雑に
```
  map.addLayer(
    new TileLayer({
      source: new XYZ((await fetchTargetTimes('raincloud')).find(x => x.tense == 'latest').layerInfo),
    })
  );
```
とすれば、読み込めます。

ちなみに雲画像は、↓のように
```
  function withBlendMode(layer, operation) {
    layer.on('precompose' , function (evt) { evt.context.globalCompositeOperation = operation; });
    layer.on('postcompose', function (evt) { evt.context.globalCompositeOperation = 'source-over'; });
    return layer;
  }

  map.addLayer(withBlendMode(
    new TileLayer({
      source: new XYZ((await fetchTargetTimes('infrared/fd')).find(x => x.tense == 'latest').layerInfo),
    })
  ), 'screen');
```
とすれば、それっぽく重なります。

## 注意事項・制限

* 無保証です。
* まだ全てのレイヤーには対応できていません。
* （勝手に付けた）レイヤーの名前がイケてないので変わる可能性があります。
* たまに `tense` が `latest` を含まないデータもあります。（予報データのみの場合など）

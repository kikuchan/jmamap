# JMA MAP Loader

## What is it?

Helper functions to obtain tile information of map provided by [Japan Meteorological Agency](https://www.jma.go.jp/)

気象庁の地図データを取得するヘルパーライブラリです。


## How to install

```
npm i jmamap
```


## How to use

### Simply with OpenLayers
```
import { JMALayer } from 'jmamap/ol';
    :
map.addLayer(new JMALayer('base'));
map.addLayer(new JMALayer('raincloud'));
```

![image](https://user-images.githubusercontent.com/445223/179498842-e7dbd463-8ba5-408a-9a8c-1c520ebfc055.png)

See [examples/ol-jmalayer](https://github.com/kikuchan/jmamap/tree/main/examples/ol-jmalayer) for more details.


### As an access helper library
```
import { fetchTargetTimes } from 'jmamap';

const targetTimes = await fetchTargetTimes('raincloud');
```

とすると

```
[{
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
}, ...]
```
のような出力が得られます。
基本部分はサーバから取得できる `targetTimes.json` そのままですが、情報を追記して、さらに `basetime`, `validtime` 順に並べかえています。

`layerInfo` の `url` の部分をそのままコピーして、例えば地理院地図の「ツール → その他 → 外部タイル」で貼り付けると、タイルをロードできます。


大抵、最新の1件（もしくは直近の予報）が欲しいと思いますので、その際は
```
const suitable = targetTimes.find(x => x.tense === 'latest') || (targetTimes.filter(x => x.tense != 'past') || [])[0]
```
などのようにして、取り出してください。


## 注意事項・制限

* 無保証です。
* まだ全てのレイヤーには対応できていません。
* （勝手に付けた）レイヤーの名前がイケてないので変わる可能性があります。
* たまに `tense` が `latest` を含まないデータもあります。（予報データのみの場合など）

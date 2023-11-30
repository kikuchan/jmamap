# JMA MAP Loader

## What is this?

Helper functions to obtain tile information of map provided by [Japan Meteorological Agency](https://www.jma.go.jp/)

気象庁の地図データを取得するヘルパーライブラリです。

Additionally, it also provides `JMALayer` layer constructor for OpenLayers.

さらに OpenLayers 用のレイヤー作成関数 `JMALayer` を提供します。


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

## List of supported layers

|ID|LayerType|Category|Name|Format|
|---|---|---|---|---|
|`base`|tile|基本地図|標準|png|
|`pale`|tile|基本地図|淡色地図(地名あり)|png|
|`pale2`|tile|基本地図|淡色地図(地名なし)|png|
|`green`|tile|基本地図|緑色地図|png|
|`mask`|tile|基本地図|マスク|png|
|`river`|tile|基本地図|河川|png|
|`cities`|vector|基本地図|自治体名|geojson|
|`himawari/jp/visibleray`|tile|ひまわり|可視画像（日本域）|jpg|
|`himawari/jp/infrared`|tile|ひまわり|赤外画像（日本域）|jpg|
|`himawari/jp/steam`|tile|ひまわり|水蒸気画像（日本域）|jpg|
|`himawari/jp/truecolor`|tile|ひまわり|トゥルーカラー再現画像（日本域）|jpg|
|`himawari/jp/cloudtop`|tile|ひまわり|雲頂強調画像（日本域）|jpg|
|`himawari/fd/visibleray`|tile|ひまわり|可視画像（全球）|jpg|
|`himawari/fd/infrared`|tile|ひまわり|赤外画像（全球）|jpg|
|`himawari/fd/steam`|tile|ひまわり|水蒸気画像（全球）|jpg|
|`himawari/fd/truecolor`|tile|ひまわり|トゥルーカラー再現画像（全球）|jpg|
|`himawari/fd/cloudtop`|tile|ひまわり|雲頂強調画像（全球）|jpg|
|`raincloud`|tile|雨雲の動き|雨雲の動き（高解像度降水ナウキャスト）|png|
|`thunder`|tile|雨雲の動き|雷活動度（雷ナウキャスト）|png|
|`tornado`|tile|雨雲の動き|竜巻発生確度（竜巻発生確度ナウキャスト）|png|
|`amds-rain10m`|vector|雨雲の動き|アメダス１０分間雨量|geojson|
|`liden`|vector|雨雲の動き|前５分間の雷の状況|geojson|
|`raincloud-nodata`|vector|雨雲の動き|観測範囲外領域 [雨雲の動き（高解像度降水ナウキャスト）]|geojson|
|`thunder-nodata`|vector|雨雲の動き|観測範囲外領域 [雷活動度（雷ナウキャスト）]|geojson|
|`tornado-nodata`|vector|雨雲の動き|観測範囲外領域 [竜巻発生確度（竜巻発生確度ナウキャスト）]|geojson|
|`linear-rainfall`|vector|雨雲の動き|線状降水帯|geojson|
|`rainfall-1h`|tile|今後の雨|1時間降水量|png|
|`rainfall-3h`|tile|今後の雨|3時間降水量|png|
|`rainfall-24h`|tile|今後の雨|24時間降水量|png|
|`weather`|tile|天気予報分布|天気|png|
|`temperature`|tile|天気予報分布|気温|png|
|`r3`|tile|天気予報分布|3時間降水量|png|
|`s3`|tile|天気予報分布|3時間降雪量|png|
|`max-temp`|tile|天気予報分布|日中の最高気温|png|
|`min-temp`|tile|天気予報分布|朝の最低気温|png|
|`temp-point`|vector|天気予報分布|気温|geojson|
|`max-temp-point`|vector|天気予報分布|日中の最高気温|geojson|
|`min-temp-point`|vector|天気予報分布|朝の最低気温|geojson|
|`weather-nodata`|vector|天気予報分布|観測範囲外領域 [天気]|geojson|
|`temperature-nodata`|vector|天気予報分布|観測範囲外領域 [気温]|geojson|
|`r3-nodata`|vector|天気予報分布|観測範囲外領域 [3時間降水量]|geojson|
|`s3-nodata`|vector|天気予報分布|観測範囲外領域 [3時間降雪量]|geojson|
|`max-temp-nodata`|vector|天気予報分布|観測範囲外領域 [日中の最高気温]|geojson|
|`min-temp-nodata`|vector|天気予報分布|観測範囲外領域 [朝の最低気温]|geojson|
|`snow`|tile|現在の雪|積雪の深さ|png|
|`snowfall-3h`|tile|現在の雪|3時間降雪量|png|
|`snowfall-6h`|tile|現在の雪|6時間降雪量|png|
|`snowfall-12h`|tile|現在の雪|12時間降雪量|png|
|`snowfall-24h`|tile|現在の雪|24時間降雪量|png|
|`snowfall-48h`|tile|現在の雪|48時間降雪量|png|
|`snowfall-72h`|tile|現在の雪|72時間降雪量|png|
|`ws`|tile|海上分布予報|風速|png|
|`wavh`|tile|海上分布予報|波の高さ|png|
|`vis`|tile|海上分布予報|視程|png|
|`icing`|tile|海上分布予報|着氷の程度|png|
|`shinsui1`|tile|危険度分布|洪水浸水想定区域（計画規模）|png|
|`shinsui2`|tile|危険度分布|洪水浸水想定区域（想定最大規模）|png|
|`landslide`|tile|危険度分布|土砂災害|png|
|`inundation`|tile|危険度分布|浸水害|png|
|`flood`|vector-tile|危険度分布|洪水害|pbf|


## 注意事項・制限

* 無保証です。
* まだ全てのレイヤーには対応できていません。
* たまに `tense` が `latest` を含まないデータもあります。（予報データのみの場合など）


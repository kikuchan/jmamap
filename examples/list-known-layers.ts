import JMA from 'jmamap'

const headers = [
  'ID',
  'LayerType',
  'Category',
  'Name',
  'Format',
];

console.log(`|${headers.join('|')}|`);
console.log(`|${headers.map(() => '---').join('|')}|`);

for (const layerId of JMA.getLayerIds()) {
  const { id, name, category, layerType, format } = JMA.getLayerInfo(layerId);

  const columns = [
    `\`${id}\``,
    layerType,
    category,
    name,
    format,
  ];

  console.log(`|${columns.join('|')}|`);
}

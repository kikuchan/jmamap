import { fetchTargetTimes } from 'jmamap';

(async () => {
  for (const layerId of process.argv.slice(2)) {
    const targetTimes = await fetchTargetTimes(layerId);
    if (targetTimes) {
      const latest = targetTimes.find(x => x.tense === 'latest') || targetTimes[targetTimes];
      console.log(latest);
    }
  }
})();

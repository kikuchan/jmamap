import { Glob, build } from 'bun';
import fs from 'node:fs';

const glob = new Glob('src/**/*.ts');

const entrypoints = [...glob.scanSync('.')];

const r = await build({
  entrypoints,
  outdir: './dist',
  external: ['ol'],
  minify: true,
});

if (!r.success) throw new Error('Compilation failed');

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

fs.writeFileSync(
  './dist/package.json',
  JSON.stringify({
    ...Object.fromEntries(
      ['name', 'version', 'description', 'author', 'homepage', 'license', 'dependencies'].map((k) => [k, pkg[k]]),
    ),

    type: 'module',
    main: './index.js',
    types: './index.d.ts',

    exports: {
      '.': {
        types: './index.d.ts',
        import: './index.js',
      },
      './ol': {
        types: './ol/index.d.ts',
        import: './ol/index.js',
      },
    },
  }),
);

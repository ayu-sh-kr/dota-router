import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
      },
    ],
    external: ['reflect-metadata'],
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        outDir: './dist',
        declaration: false, // Let dts handle declarations instead
        declarationDir: null // Don't create a separate 'types' directory
      }),
    ],
  },
  {
    // Bundle declaration files
    input: 'src/index.ts',
    output: [{file: 'dist/index.d.ts', format: 'es'}],
    plugins: [dts()],
  },
];

export default config;
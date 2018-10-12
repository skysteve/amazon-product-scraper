import typescript from 'rollup-plugin-typescript';

export default {
  input: './public/ts/index.ts',
  plugins: [
    typescript({
      "lib": [
        "es2017",
        "dom"
      ],
      "moduleResolution": "node",
      "target": "es6",
      "strict": true,
      "skipLibCheck": true,
      "noUnusedLocals": true,
      "noImplicitAny": false,
      "strictFunctionTypes": false,
      "strictPropertyInitialization": true,
      "strictNullChecks": true
    })
  ],
  output: {
    file: './public/js/bundle.js',
    format: 'cjs'
  }
}


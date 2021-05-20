const f = require('node-fetch')

const langs = [
  'python',
  'cpp',
  'c',
  'java',
  'js',
  'ruby',
  'rust',
  'lua',
  'go',
  'csharp',
  'haskell',
  'ts',
  'swift',
  'perl',
  'coffescript',
]

async function python(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'cpython-head' }),
  })

  return res
}

async function cpp_c(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'gcc-head' }),
  })

  return res
}

async function java(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'openjdk-head' }),
  })

  return res
}

async function js(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'nodejs-head' }),
  })

  return res
}

async function lua(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'lua-5.4.0' }),
  })

  return res
}

async function rust(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'rust-head' }),
  })

  return res
}

async function go(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'go-1.14.2' }),
  })

  return res
}

async function csharp(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'mcs-head' }),
  })

  return res
}

async function haskell(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'ghc-head' }),
  })

  return res
}

async function ruby(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'ruby-head' }),
  })

  return res
}

async function ts(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({
      code: code,
      save: true,
      compiler: 'typescript-3.9.5',
    }),
  })

  return res
}

async function swift(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'swift-head' }),
  })

  return res
}

async function perl(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({ code: code, save: true, compiler: 'perl-head' }),
  })

  return res
}

async function coffeescript(code) {
  const res = await f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({
      code: code,
      save: true,
      compiler: 'coffeescript-head',
    }),
  })

  return res
}

module.exports = {
  langs: langs,
  python: python,
  cpp: cpp_c,
  c: cpp_c,
  ruby: ruby,
  rust: rust,
  go: go,
  js: js,
  java: java,
  haskell: haskell,
  csharp: csharp,
  lua: lua,
  ts: ts,
  swift: swift,
  perl: perl,
  coffeescript: coffeescript,
}

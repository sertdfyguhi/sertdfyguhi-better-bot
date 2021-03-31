const f = require('sync-fetch')

const langs = ['python', 'c++', 'c', 'java', 'js', 'ruby', 'rust', 'lua', 'go', 'csharp', 'haskell', 'ts', 'swift']

function python(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "cpython-head"})}).json();
  
  return res
}

function cpp_c(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "gcc-head"})}).json();
  
  return res
}

function java(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "openjdk-head"})}).json();
  
  return res
}

function js(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "nodejs-head"})}).json();
  
  return res
}

function lua(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "lua-5.4.0"})}).json();
  
  return res
}

function rust(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "rust-head"})}).json();
  
  return res
}

function go(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "go-head"})}).json();
  
  return res
}

function csharp(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "mcs-head"})}).json();
  
  return res
}

function haskell(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "ghc-head"})}).json();
  
  return res
}

function ruby(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "ruby-head"})}).json();
  
  return res
}

function ts(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "typescript-3.9.5"})}).json();
  
  return res
}

function swift(code) {
  const res = f('https://wandbox.org/api/compile.json', {
    method: 'POST',
    body: JSON.stringify({code: code, save: true, compiler: "swift-head"})}).json();
  
  return res
}

module.exports = {
  langs: langs,
  python: python,
  cpp_c: cpp_c,
  ruby: ruby,
  rust: rust,
  go: go,
  js: js,
  java: java,
  haskell: haskell,
  csharp: csharp,
  lua: lua,
  ts: ts,
  swift: swift
}
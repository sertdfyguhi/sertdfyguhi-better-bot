const discord = require('discord.js')
const fetch = require('sync-fetch')
const figlet = require('figlet')
const { createCanvas } = require('canvas')

function get_shibe() {
  const res = fetch('https://shibe.online/api/shibes')
  return res.json()[0]
}

function get_cat() {
  const res = fetch('https://api.thecatapi.com/v1/images/search')
  return res.json()[0].url
}

function text_to_ascii(text, cb) {
  figlet(text, (err, data) => {
    if (err) {
      cb(err)
    } else {
      cb(data)
    }
  })
}

function create_color_img(color) {
  const canvas = createCanvas(1000, 1000)
  const context = canvas.getContext('2d')

  context.fillStyle = color
  context.fillRect(0, 0, 1000, 1000)

  return canvas
}

function _arr_to_str(array) {
  let new_array = []

  for (const element of array) {
    if (Array.isArray(element) == false && typeof element == 'object') {
      new_array.push(JSON.stringify(element, null, 2))
    } else if (Array.isArray(element)) {
      new_array.push(_arr_to_str(element))
    } else if (typeof element == 'string') {
      new_array.push('"' + element + '"')
    } else {
      new_array.push(element.toString())
    }
  }

  return `[${new_array.join(', ')}]`
}

function json_embed(content) {
  const embed = new discord.MessageEmbed()
    .setTitle('JSON representation')
    .setColor('#FAA61A')

  let json;

  try {
    json = JSON.parse(content)
  } catch (e) {
    return 'error\n' + '```' + e + '```'
  }

  embed.setDescription('```json\n' + JSON.stringify(json, null, 2) + '```')

  for (const el in json) {
    if (Array.isArray(json[el])) {
      embed.addField(`**${el}**`, '```json\n' + _arr_to_str(json[el]) + '```', true)
    } else if (typeof json[el] == 'object') {
      embed.addField(`**${el}**`, '```json\n' + JSON.stringify(json[el], null, 2) + '```', true)
    } else {
      embed.addField(`**${el}**`, '```' + json[el].toString() + '```', true)
    }
  }

  if (embed.fields.length > 25) {
    return 'too many fields'
  } else if (embed.length > 2000) {
    return 'embed too long'
  } else {
    return embed
  }
}

function remove_backticks(string) {
  if (string.startsWith('`')) {
    if (string.startsWith('```')) {
      string = string.substr(string.indexOf('\n') + 1)
      string = string.substring(0, string.length - 4)
    } else {
      string = string.slice(1, -1)
    }
  }

  return string
}

module.exports = {
  json_embed: json_embed,
  remove_backticks: remove_backticks,
  get_shibe: get_shibe,
  get_cat: get_cat,
  text_to_ascii: text_to_ascii,
  create_color_img: create_color_img
}
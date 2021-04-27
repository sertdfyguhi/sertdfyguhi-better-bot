const discord = require('discord.js')
const array = require('./array')

function json_rep(content) {
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
      embed.addField(`**${el}**`, '```json\n' + array.deal_with(json[el]) + '```', true)
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

module.exports = json_rep
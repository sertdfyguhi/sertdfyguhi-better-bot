// todo:
// nothing

const discord = require('discord.js')

const config = require('./config.json')
const run = require('./run.js')

const client = new discord.Client()

client.on('ready', function () {
  console.log('logged in')
  client.user.setActivity('do s!help for help')
})

client.on('message', function (message) {
  if (message.content === `${config.prefix}help`) {
    // help command

    const embed = new discord.MessageEmbed()
      .setColor('#3268a8')
      .setTitle('Commands')
      .setDescription('Prefix: `s!`\n\n')
      .addField(
        '**Commands**',
        '`.code {lang} {code}`: executes code.\n`.langs`: all programming languages that is valid.'
      )
      .setFooter('made by sertdfyguhi#5971')

    message.channel.send(embed)
  } else if (message.content === `${config.prefix}langs`) {
    // langs command

    let langs = ''

    for (const lang of run.langs) {
      langs += '`' + lang + '` '
    }

    const embed = new discord.MessageEmbed()
      .setColor('#3268a8')
      .setTitle('Languages')
      .setDescription(langs)
      .setFooter('made by sertdfyguhi#5971')

    message.channel.send(embed)
  } else if (message.content.startsWith(`${config.prefix}code`)) {
    // code command

    let split = message.content.split(' ')

    let lang_lower = split[1].toLowerCase()

    if (lang_lower.includes('\n')) {
      split.splice(2, 0, lang_lower.substring(lang_lower.indexOf('\n') + 1))
      split[1] = split[1].replace(
        lang_lower.substring(lang_lower.indexOf('\n') - 1),
        ''
      )
      lang_lower = lang_lower.substr(0, lang_lower.indexOf('\n'))
    }

    let code = message.content.substr(split[0].length + split[1].length + 2)
    let embed = new discord.MessageEmbed()
      .setTitle("sertdfyguhi's code bot")
      .setFooter('Requested by @' + message.author.username)

    if (code.startsWith('\n')) {
      code = code.substring(1)
    }

    if (code.startsWith('```') && code.endsWith('```')) {
      const s = code.split('\n')
      s.shift()

      if (!s[s.length - 1].endsWith('```')) {
        s.pop()
      }

      s[s.length - 1] = s[s.length - 1].substr(
        0,
        s[s.length - 1].indexOf('```')
      )

      code = s.join('\n')
    }

    if (run.langs.includes(lang_lower) && code != '') {
      let res

      res = run[lang_lower](code)

      if (!res.program_error && !res.compiler_error) {
        try {
          embed.addField('Output', '```\n' + res.program_output + '```')
        } catch (e) {
          embed.addField(
            'Output',
            'Program output is too long, please use permlink instead.'
          )
        }

        embed.setColor('#4aff5c')
      } else {
        if (!res.compiler_error) {
          embed.addField('Output', '```\n' + res.program_error + '```')
        } else {
          embed.addField('Output', '```\n' + res.compiler_error + '```')
        }

        embed.setColor('#ff2b4f')
      }

      embed.addField('permlink', res.url)

      if (embed.length > 2000) {
        embed.fields[0].value =
          'Program output is too long, please use permlink instead.'
      }

      message.channel.send(embed)
    } else {
      if (code == '') {
        message.channel.send('No code to run.')
      }
      message.channel.send(
        'Invalid language. Please do `.langs` for all the langauges.'
      )
    }
  } else {
    if (
      message.author != client.user &&
      message.content.startsWith(config.prefix)
    ) {
      message.channel.send('Invalid command.')
    }
  }
})

client.login(process.env.token)

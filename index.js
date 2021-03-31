// this code is messy

// todo:
// add comments

const discord = require('discord.js')
const config = require('./config.json')
const run = require('./run.js')

const client = new discord.Client()

client.on('ready', function(){
  console.log('logged in')
  client.user.setActivity('hey guys do s!help for help')
})

client.on('message', function(message){
  if (message.content === `${config.prefix}help`) {
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
    const split = message.content.split(' ')
    let code = message.content.substr(split[0].length + 2 + split[1].length)
    let embed = new discord.MessageEmbed()
      .setTitle('sertdfyguhi\'s code bot')
      .setFooter('Requested by @' + message.author.username)

    let req;

    if (code.startsWith('```') && code.endsWith('```')) {
      const s = code.split('\n')
      s.pop()
      s.shift()

      code = s.join('')
    }

    if (run.langs.includes(split[1].toLowerCase())) {
      switch (split[1].toLowerCase()) {
        case 'python':
          req = run.python(code)
          break
        case 'js':
          req = run.js(code)
          break
        case 'ruby':
          req = run.ruby(code)
          break
        case 'haskell':
          req = run.haskell(code)
          break
        case 'go':
          req = run.go(code)
          break
        case 'c++' || 'c':
          req = run.cpp_c(code)
          break
        case 'rust':
          req = run.rust(code)
          break
        case 'java':
          req = run.java(code)
          break
        case 'lua':
          req = run.lua(code)
          break
        case 'csharp':
          req = run.csharp(code)
          break
      }
      
      if (typeof req.program_error === 'undefined') {
        if (code != '') {
          embed.addField('Output', '```\n' + req.program_output + '```')
        } else {
          embed.addField('Output', '``` ```')
        }

        embed.setColor('#4aff5c')
      } else {
        embed.addField('Output', '```\n' + req.program_error + '```')
        embed.setColor('#ff2b4f')
      }

      embed.addField('URL', req.url)

      message.channel.send(embed)
    } else {
      message.channel.send('Invalid language. Please do `.langs` for all the langauges.')
    }
  }
})

client.login(process.env.token)
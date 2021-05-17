const discord = require('discord.js')
const rp = require('random-puppy')
const h = require('hgdfhjvysger')

const prefix = 's!'
const helper = require('./helper')
const run = require('./run')
const github = require('./github')
const keepalive = require('./keepalive')

const client = new discord.Client()

client.on('ready', function() {
  console.log(`Logged in as \u001b[33m${client.user.tag}\u001b[0m`)

  client.user.setActivity('do s!help for help')
})

client.on('message', function (msg) {
  if (msg.author.bot) return;
  
  if (msg.content.startsWith(`${prefix}json`)) {
    // json and jsons command
    if (msg.content.startsWith(`${prefix}jsons`))  {
      if (msg.content == `${prefix}jsons` ||
          msg.content == `${prefix}jsons `) {
        msg.channel.send('no json provided')
        return
      }
      let content = helper.remove_backticks(msg.content.substr(8))

      try {
        for (const json of JSON.parse(content)) {
          msg.channel.send(helper.json_embed(JSON.stringify(json)))
        }
      } catch (e) {
        msg.channel.send('error\n' + '```' + e + '```')
        return
      }
    } else {
      if (msg.content == `${prefix}json` ||
          msg.content == `${prefix}json `) {
        msg.channel.send('no json provided')
        return
      }

      let content = helper.remove_backticks(msg.content.substr(7))
      msg.channel.send(helper.json_embed(content))
    }
  } else if (msg.content == `${prefix}help`) {
    // help command

    const embed = new discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Help')
      .setDescription('Prefix: `' + prefix + '`')
      .addField(
        '**Commands**',
        '`s!help`: shows all commands.\
        \n`s!code {lang} {code}`: executes code.\
        \n`s!langs`: all programming languages that is valid.\
        \n`s!user {github user}`: info about a github account.\
        \n`s!repo {github user} {repo}`: info abount a github repo.\
        \n`s!json {json}`: json reprensentation in embed.\
        \n`s!jsons {array of jsons}`: json reprensentation in embed.\
        \n`s!shibe`: sends a picture of a shibe.\
        \n`s!cat`: sends a picture of a cat.\
        \n`s!earth`: random picture from r/earthporn\
        \n`s!randomcolor`: random color in embed.\
        \n`s!asciiart {text}`: convert text into ascii art.'
      )
      .addField(
        '**Repo**',
        'https://github.com/sertdfyguhi/sertdfyguhi-better-bot'
      )
      .setFooter('made by sertdfyguhi#5971')

    msg.channel.send(embed)
  } else if (msg.content == `${prefix}langs`) {
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

    msg.channel.send(embed)
  } else if (msg.content.startsWith(`${prefix}user`)) {
    let split = msg.content.split(' ')

    if (!split[1] || split[1] == '') {
      msg.channel.send('No user given.')
      return null
    }

    const info = github.user(split[1])
    let embed = new discord.MessageEmbed()
    if (info.message) {
      msg.channel.send('User not found.')
    } else {
      embed
        .setTitle(info.login)
        .setURL(info.html_url)
        .setThumbnail(info.avatar_url)

      if (!info.bio == null) {
        embed.setDescription(info.bio)
      }

      embed
        .addField('Followers', info.followers, true)
        .addField('Following', info.following, true)
        .addField('Repos', info.public_repos, true)
        .addField('Gists', info.public_gists, true)
        .addField('Created on', info.created_at, true)
        .addField('Updated on', info.updated_at, true)

      msg.channel.send(embed)
    }
  } else if (msg.content.startsWith(`${prefix}repo`)) {
    let split = msg.content.split(' ')

    if (!split[1] || split[1] == '') {
      msg.channel.send('No user given.')
      return null
    } else if (!split[2]) {
      msg.channel.send('No repo name given.')
      return null
    }

    const info = github.repo(split[1], split[2])

    if (info.message) {
      msg.channel.send('Repo not found.')
    } else {
      let embed = new discord.MessageEmbed()
        .setTitle(info.name)
        .setURL(info.html_url)
        .setAuthor(info.owner.login, info.owner.avatar_url, info.owner.html_url)

      if (info.description != null) {
        embed.setDescription(info.description)
      }

      embed
        .addField('Stars', info.stargazers_count, true)
        .addField('Watchers', info.subscribers_count, true)
        .addField('Open issues', info.open_issues_count, true)
        .addField('Forks', info.forks, true)
        .addField('Created on', info.created_at, true)
        .addField('Last updated on', info.updated_at, true)
        .addField('Last commited on', info.pushed_at, true)

      msg.channel.send(embed)
    }
  } else if (msg.content.startsWith(`${prefix}code`)) {
    // code command
    let split = msg.content.split(' ')
    let lang_lower;

    try {
      lang_lower = split[1].toLowerCase()
    } catch (e) {
      msg.channel.send('nothing provided')
      return
    }

    if (lang_lower.includes('\n')) {
      split.splice(2, 0, lang_lower.substring(lang_lower.indexOf('\n') + 1))
      split[1] = split[1].replace(
        lang_lower.substring(lang_lower.indexOf('\n') - 1),
        ''
      )
      lang_lower = lang_lower.substr(0, lang_lower.indexOf('\n'))
    }

    let code = msg.content.substr(split[0].length + split[1].length + 2)

    let embed = new discord.MessageEmbed()
      .setTitle("sertdfyguhi's code bot")
      .setFooter('Requested by @' + msg.author.username)

    code = helper.remove_backticks(code)

    if (run.langs.includes(lang_lower) && code != '') {
      let res

      res = run[lang_lower](code)

      if (!res.program_error && !res.compiler_error && res.program_output) {
        try {
          embed.addField('Output', '```\n' + res.program_output + '```')
        } catch (e) {
          embed.addField(
            'Output',
            'Program output is too long, please use permlink instead.'
          )
        }

        embed.setColor('#4aff5c')
      } else if (res.program_error || res.compiler_error) {
        if (!res.compiler_error) {
          embed.addField('Output', '```\n' + res.program_error + '```')
        } else {
          embed.addField('Output', '```\n' + res.compiler_error + '```')
        }

        embed.setColor('#ff2b4f')
      } else {
        embed.addField('Output', 'No output from program.')

        embed.setColor('#4aff5c')
      }

      embed.addField('permlink', res.url)

      if (embed.length > 1024) {
        embed.fields[0].value =
          'Program output is too long, please use permlink instead.'
      }

      msg.channel.send(embed)
    } else {
      if (code == '') {
        msg.channel.send('No code to run.')
      }
      msg.channel.send(
        'Invalid language. Please do `.langs` for all the langauges.'
      )
    }
  } else if (msg.content == `${prefix}shibe`) {
    // shibe command
    const embed = new discord.MessageEmbed()
      .setImage(helper.get_shibe())
      .setColor('#34c6eb')
      
    msg.channel.send(embed)
  } else if (msg.content == `${prefix}cat`) {
    // cat command
    const embed = new discord.MessageEmbed()
      .setImage(helper.get_cat())
      .setColor('#34c6eb')
      
    msg.channel.send(embed)
  } else if (msg.content == `${prefix}earth`) {
    rp('earthporn').then(url => {
      const embed = new discord.MessageEmbed()
        .setImage(url)
        .setColor('#34c6eb')
      
      msg.channel.send(embed)
    })
  } else if (msg.content == `${prefix}randomcolor`) {
    const color = h.randomColor()
    const embed = new discord.MessageEmbed()
      .setTitle('This is your random color.')
      .setDescription('`' + color + '`')
      .setColor(color)

    msg.channel.send(embed)
  } else if (msg.content.startsWith(`${prefix}asciiart`)) {
    const text = msg.content.substr(11)
    if (text == '') {
      msg.channel.send('No text provided.')
    } else {
      const converted = helper.text_to_ascii(text)
      if (converted.length + 6 > 2000) {
        msg.channel.send('Converted ascii art too long.')
      } else {
        msg.channel.send('```' + helper.text_to_ascii(text) + '```')
      }
    }
  } else {
    if (msg.content.startsWith(prefix)) {
      msg.channel.send('Invalid command.')
    }
  }
})

keepalive(client)
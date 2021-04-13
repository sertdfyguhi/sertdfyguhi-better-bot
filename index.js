// todo:
// nothing

const discord = require('discord.js')

const prefix = 's!'
// const token = require('./token.json')
const run = require('./run.js')
const github = require('./github.js')

const client = new discord.Client()

let mention;

client.on('ready', function () {
  console.log('logged in')

  mention  = '<@!' + client.user.id + '>'

  client.user.setActivity('do s!help for help')
})

client.on('message', function (message) {
  if (
    message.content === `${prefix}help` ||
    message.content === `${mention} help`
  ) {
    // help command

    const embed = new discord.MessageEmbed()
      .setColor('#3268a8')
      .setTitle('Commands')
      .setDescription('Prefix: `s!` or pinging me\n\n')
      .addField(
        '**Commands**',
        '`s!help`: shows all commands.\n`.code {lang} {code}`: executes code.\
        \n`s!langs`: all programming languages that is valid.\
        \n`s!user {github user}`: info about a github account.\
        \n`s!repo {github user} {repo}`: info abount a github repo.'
      )
      .setFooter('made by sertdfyguhi#5971')

    message.channel.send(embed)
  } else if (
    message.content === `${prefix}langs` ||
    message.content === `${mention} langs`
  ) {
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
  } else if (
    message.content.startsWith(`${prefix}user`) ||
    message.content.startsWith(`${mention} user`)
  ) {
    let split = message.content.split(' ')

    if (!split[1] || split[1] == '') {
      message.channel.send('No user given.')
      return null
    }

    if (message.content.startsWith(mention)) {
      split.shift()
    }

    const info = github.user(split[1])
    let embed = new discord.MessageEmbed()
    if (info.message) {
      message.channel.send('User not found.')
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

      message.channel.send(embed)
    }
  } else if (
    message.content.startsWith(`${prefix}repo`) ||
    message.content.startsWith(`${mention} repo`)
  ) {
    let split = message.content.split(' ')

    if (!split[1] || split[1] == '') {
      message.channel.send('No user given.')
      return null
    } else if (!split[2]) {
      message.channel.send('No repo name given.')
      return null
    }

    if (message.content.startsWith(mention)) {
      split.shift()
    }

    const info = github.repo(split[1], split[2])

    if (info.message) {
      message.channel.send('Repo not found.')
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

      message.channel.send(embed)
    }
  } else if (
    message.content.startsWith(`${prefix}code`) ||
    message.content.startsWith(`${mention} code`)
  ) {
    // code command

    let split = message.content.split(' ')

    if (message.content.startsWith(mention)) {
      split.shift()
    }

    let lang_lower = split[1].toLowerCase()

    if (lang_lower.includes('\n')) {
      split.splice(2, 0, lang_lower.substring(lang_lower.indexOf('\n') + 1))
      split[1] = split[1].replace(
        lang_lower.substring(lang_lower.indexOf('\n') - 1),
        ''
      )
      lang_lower = lang_lower.substr(0, lang_lower.indexOf('\n'))
    }

    let code;
    if (message.content.startsWith(mention)) {
      code = message.content.substr(split[0].length + split[1].length + 22 + 3)
    } else {
      code = message.content.substr(split[0].length + split[1].length + 2)
    }
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
      message.content.startsWith(prefix)
    ) {
      message.channel.send('Invalid command.')
    }
  }
})

client.login(process.env.token)
// client.login(token.token)

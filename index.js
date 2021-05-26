const discord = require('discord.js')
const rp = require('random-puppy')
const h = require('hgdfhjvysger')

const prefix = 's!'
const helper = require('./helper')
const run = require('./run')
const github = require('./github')
const keepalive = require('./keepalive')
const help = require('./help.json')

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
  } else if (msg.content.startsWith(`${prefix}help`)) {
    // help command
    const page = msg.content.split(' ')[1]

    if (!page || page > help.pages.length) {
      msg.channel.send(`Use \`s!help {page number: 1 to ${help.pages.length}}\` for commands.`)
      return
    }

    const page_num = parseInt(page)
    
    const embed = new discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Help')
      .setDescription(`Prefix: \`${prefix}\``)
      .addField(
        'Commands',
        help.pages[page_num - 1].join('\n')
      )
      .addField(
        'Repo',
        'https://github.com/sertdfyguhi/sertdfyguhi-better-bot'
      )
      .addField(
        'Bot invite',
        'https://discord.com/api/oauth2/authorize?client_id=826414044448555049&permissions=2048&scope=bot'
      )
      .setFooter('made by sertdfyguhi#5971')

    msg.channel.send(embed)
  } else if (msg.content == `${prefix}langs`) {
    // langs command
    let langs = ''

    for (const lang of run.langs) langs += '`' + lang + '` '

    const embed = new discord.MessageEmbed()
      .setColor('#3268a8')
      .setTitle('Languages')
      .setDescription(langs)
      .setFooter('made by sertdfyguhi#5971')

    msg.channel.send(embed)
  } else if (msg.content.startsWith(`${prefix}user `)) {
    let split = msg.content.split(' ')

    if (!split[1] || split[1] == '') {
      msg.channel.send('No user given.')
      return null
    }

    github.user(split[1])
      .then(res => res.json())
      .then(info => {
        let embed = new discord.MessageEmbed()
        if (info.message) {
          msg.channel.send('User not found.')
        } else {
          embed
            .setTitle(info.login)
            .setURL(info.html_url)
            .setThumbnail(info.avatar_url)
            .addField('Followers', info.followers, true)
            .addField('Following', info.following, true)
            .addField('Repos', info.public_repos, true)
            .addField('Gists', info.public_gists, true)
            .addField('Created on', info.created_at, true)
            .addField('Updated on', info.updated_at, true)
          
          if (!info.bio == null) embed.setDescription(info.bio)

          msg.channel.send(embed)
        }
      })
  } else if (msg.content.startsWith(`${prefix}repo`)) {
    let split = msg.content.split(' ')

    if (!split[1] || split[1] == '') {
      msg.channel.send('No user given.')
      return null
    } else if (!split[2]) {
      msg.channel.send('No repo name given.')
      return null
    }

    github.repo(split[1], split[2])
      .then(res => res.json())
      .then(info => {
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
      })
  } else if (msg.content.startsWith(`${prefix}code`)) {
    // code command
    let split = msg.content.split(' ')
    let lang_lower;

    try {
      lang_lower = split[1].toLowerCase()
    } catch (e) {
      msg.channel.send('Nothing provided')
      return
    }

    if (lang_lower.includes('\n')) {
      split.splice(2, 0, lang_lower.substring(lang_lower.indexOf('\n') + 1))
      split[1] = split[1].replace(
        lang_lower.substring(lang_lower.indexOf('\n') - 1),''
      )
      lang_lower = lang_lower.substr(0, lang_lower.indexOf('\n'))
    }

    let code = msg.content.substr(split[0].length + split[1].length + 2)

    let embed = new discord.MessageEmbed()
      .setTitle("sertdfyguhi's code bot")
      .setFooter('Requested by @' + msg.author.username)

    code = helper.remove_backticks(code)

    if (run.langs.includes(lang_lower) && code != '') {
      run[lang_lower](code)
        .then(res => res.json())
        .then(res => {
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
        })
    } else {
      if (code != '') {
        msg.channel.send(
          'Invalid language. Please do `.langs` for all the langauges.'
        )
      } else {
        msg.channel.send('No code to run.')
      }
    }
  } else if (msg.content == `${prefix}shibe`) {
    // shibe command
    helper.get_shibe()
      .then(res => res.json())
      .then(data => {
        const embed = new discord.MessageEmbed()
          .setImage(data[0])
          .setColor('#34c6eb')
      
        msg.channel.send(embed)
      })
  } else if (msg.content == `${prefix}cat`) {
    // cat command
    helper.get_cat()
      .then(res => res.json())
      .then(data => {
        const embed = new discord.MessageEmbed()
          .setImage(data[0].url)
          .setColor('#34c6eb')
          
        msg.channel.send(embed)
      })
  } else if (msg.content == `${prefix}earth`) {
    // earth command
    rp('earthporn')
      .then(url => {
      const embed = new discord.MessageEmbed()
        .setImage(url)
        .setColor('#34c6eb')
      
      msg.channel.send(embed)
    })
  } else if (msg.content == `${prefix}randomcolor`) {
    // randomcolor command
    const color = h.randomColor()
    const attachment = new discord.MessageAttachment(helper.create_color_img(color),'color.png')

    const embed = new discord.MessageEmbed()
      .attachFiles(attachment)
      .setTitle('This is your random color.')
      .setDescription('`' + color + '`')
      .setColor(color)
      .setImage('attachment://color.png')

    msg.channel.send(embed)
  } else if (msg.content.startsWith(`${prefix}asciiart`)) {
    // ascii art command
    const text = msg.content.substr(11)
    if (text == '') {
      msg.channel.send('No text provided.')
    } else {
      helper.text_to_ascii(text, data => {
        if (data.length + 6 > 2000) {
          msg.channel.send('Ascii art too long.')
        } else {
          msg.channel.send('```' + data + '```')
        }
      })
    }
  } else if (msg.content.startsWith(`${prefix}userinfo`)) {
    // userinfo command
    const user = msg.mentions.users.first()
    const member = msg.guild.member(user)
    if (user) {
      const embed = new discord.MessageEmbed()
        .setTitle(`${user.tag}\'s info`)
        .setTimestamp()
        .addField('Username', user.username, true)
        .addField('Status', user.presence.status, true)
        .addField('Discord ID', user.id, true)
        .addField('Joined at', member.joinedAt.toDateString(), true)
        .addField('Created at', user.createdAt.toDateString(), true)
        .addField('Nickname', member.nickname || 'No nickname', true)
        .setColor('RANDOM')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        

      let roles = []
      member.roles.cache.each(r => {
        if (r.id == msg.guild.roles.everyone.id) return
        roles.push(r)
      })

      embed.addField('Roles', roles.join(' ') || 'No roles', true)

      msg.channel.send(embed)
    } else {
      msg.channel.send('Invalid user.')
    }
  } else if (msg.content == `${prefix}serverinfo`) {
    const embed = new discord.MessageEmbed()
      .setTitle('Server info')
      .setThumbnail(msg.guild.iconURL())
      .setColor('RANDOM')
      .addField('Server name', msg.guild.name, true)
      .addField('Member count', msg.guild.memberCount, true)
      .addField('Role count', msg.guild.roles.cache.size, true)
      .addField(
        'Bot count',
        msg.guild.members.cache.filter((member) => member.user.bot).size,
        true
      )
      .addField('Channel count', msg.guild.channels.cache.size, true)
      .addField('Created at', msg.guild.createdAt.toDateString(), true)
      .addField('Server owner', msg.guild.owner, true)
    msg.channel.send(embed)
  } else if (msg.content.startsWith(`${prefix}color`)) {
    const color = msg.content.split(' ')[1]
    if (helper.check_hex(color)) {
      const buffer = helper.create_color_img(color).toBuffer('image/png')
      const attachment = new discord.MessageAttachment(buffer, 'color.png')

      const embed = new discord.MessageEmbed()
        .attachFiles(attachment)
        .setTitle('Color `' + color + '`')
        .setColor(color)
        .setImage('attachment://color.png')

      msg.channel.send(embed)
    } else {
      msg.channel.send('Invalid hex color code.')
    }
  } else if (msg.content.startsWith(`${prefix}carbon`)) {
    let hex = msg.content.split(' ')[1]
    if (hex == '' || !hex) {
      msg.channel.send('No hex color code provided.')
      return
    }
    if (hex.toLowerCase() == 'random') {
      hex = h.randomColor()
    }
    const code = helper.remove_backticks(msg.content.substr(hex.length + 10))
    if (helper.check_hex(hex)) {
      const rgb = helper.hex_to_rgb(hex)
      const rgb_str = `rgb(${rgb.join(' ')})`
      helper.get_carbon(code, rgb_str)
        .then(res => res.buffer())
        .then(buffer => {
          const attachment = new discord.MessageAttachment(buffer, 'carbon.png')

          const embed = new discord.MessageEmbed()
            .attachFiles(attachment)
            .setColor(hex)
            .setImage('attachment://carbon.png')

          msg.channel.send(embed)
        })
    }
  } else if (msg.content.startsWith(`${prefix}randomcap`)) {
    const text = msg.content.substr(12)
    if (text == '') {
      msg.channel.send('No text provided.')
    } else {
      msg.channel.send(helper.rand_cap(text))
    }
  } else if (msg.content == `${prefix}japan`) {
    rp('japanpics')
      .then(url => {
        const embed = new discord.MessageEmbed()
          .setImage(url)
          .setColor('#add8e6')
      
        msg.channel.send(embed)
      })
  } else if (msg.content.startsWith(`${prefix}subreddit`)) {
    const sub = msg.content.split(' ')[1]
    helper.get_reddit_post(sub)
      .then(res => res.json())
      .then(data => {
        try {
          if (data.error || data.data.children == false) {
            msg.channel.send('Subreddit not found.')
          } else {
            const message = helper.create_post_emb(data)
            msg.channel.send(message)
          }
        } catch (e) {
          const message = helper.create_post_emb(data)
          msg.channel.send(message)
        }
      })
  } else {
    if (msg.content.startsWith(prefix)) {
      msg.channel.send('Invalid command.')
    }
  }
})

keepalive(client)
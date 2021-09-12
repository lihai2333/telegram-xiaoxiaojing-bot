import Search from './search'
import Ad from './ad'

import { markdown } from './escape'

interface Query {
  username: string[]
  title: string
  desc: string
  type: ['bot' | 'supergroup' | 'channel']
  members: number[]
  verify: boolean[]
  length: number
}

const ad = new Ad()
const search = new Search()

function emoji (type: 'bot' | 'supergroup' | 'channel' | 'NSFWchannel'): string {
  if (type === 'bot') {
    return '\uD83E\uDD16'
  }

  if (type === 'supergroup') {
    return '\uD83D\uDC65'
  }

  if (type === 'channel' || type === 'NSFWchannel') {
    return '\uD83D\uDCE2'
  }
}

function numberOfPeople (number: number): string {
  let l = String(number).length

  if (l > 3 && l < 7) {
    return (number / 1000).toFixed(1) + 'K'
  }

  if (l > 6) {
    return (number / 100_0000).toFixed(1) + 'M'
  }

  return String(number)
}

export default async (text: string, skip: number, adOpen: boolean): Promise<[string, number]> => {
  const results: Query[] = await search.find(text, skip)

  let msg: string = (adOpen === true && results.length !== 0) ? `\\[Ad] ${await ad.getAdContent()}` + '\n\n' : ''

  for (let i = 0; i < (results.length === 11 ? 10 : results.length); i++) {
    results[i].title = markdown(results[i].title)
    msg += `${skip + i + 1}. ${emoji(results[i].type[0])} [${results[i].title.length > 20
      ? results[i].title.substr(0, 20) + '...'
      : results[i].title}](https://t.me/${results[i].username[0]})`
      + (results[i].type[0] === 'bot'
        ? ''
        : ` - ${numberOfPeople(results[i].members[0]).replace('.0', '')}`)
      + (results[i].verify?.[0] === undefined ? '' : ' \u2611\uFE0F')
      + '\n'
  }

  return [msg, results.length]
}

import Search from './search'

import { markdown } from './escape'

interface Query {
  username: string[]
  title: string
  desc: string
  type: ['bot' | 'supergroup' | 'channel']
  members:number[]
  length: number
}

function emoji (type: 'bot' | 'supergroup' | 'channel'): string {
  if (type === 'bot') {
    return '\uD83E\uDD16'
  }

  if (type === 'supergroup') {
    return '\uD83D\uDC65'
  }

  if (type === 'channel') {
    return '\uD83D\uDCE2'
  }
}

export default async (text: string, skip: number): Promise<[string, number]> => {
  const results: Query[] = await new Search().find(text, skip)

  let msg: string = ''

  for (let i = 0; i < (results.length === 11 ? 10 : results.length); i++) {
    results[i].title = markdown(results[i].title)
    msg += `${skip + i + 1}. ${emoji(results[i].type[0])} [${results[i].title.length > 20
      ? results[i].title.substr(0, 20) + '...'
      : results[i].title}](https://t.me/${results[i].username[0]})` + '\n'
  }

  return [msg, results.length]
}

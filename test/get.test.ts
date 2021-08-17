/* eslint-env mocha */

import get from '../src/lib/get'

describe('Get', async () => {
  it('Get channle', async () => {
    const result = await get('xiaolanjing')
    console.log(result)
  })

  it('Get bot', async () => {
    const result = await get('gmailbot')
    console.log(result)
  })

  it('Get supergroup', async () => {
    const result = await get('xiaolanjingroup')
    console.log(result)
  })
})


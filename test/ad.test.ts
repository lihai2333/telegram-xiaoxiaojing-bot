/* eslint-env mocha */

import Ad from '../src/lib/ad'

describe('Ad', async () => {
  it('Check', async () => {
   const result = await new Ad().check(1)
   console.log(result)
  })
})

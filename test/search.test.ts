/* eslint-env mocha */

import Search from '../src/lib/search'

const search = new Search()

describe('Search class', () => {
  it('Add', async () => {
    await search.add(
      'fastgit',
      'FastGit UK Chat',
      `😄 Official FastGit UK Telegram Group.
🤖 English & Chinese chat only.
👉🏻 Our website is https://fastgit.org
❌ Political & NSFW related topics are not allowed.`,
      'supergroup',
      400
    )
  })

  it('Check', async () => {
    const obj = await search.check('fastgit')
    console.log(obj)
  })

  it('Query', async () => {
    const obj = await search.find('Fastgit', 0)
    console.log(obj[0].title)
    console.log(obj[0].type)
    console.log(obj[0].desc)
    console.log(obj[0].members)
    console.log(obj[0].username)
  })

  it('Check', async () => {
    const obj = await search.check('fastgit')
    console.log(obj)
  })

  it('Remove', async () => {
    await search.remove('fastgit')
  })

  it('Check', async () => {
    const obj = await search.check('fastgit')
    console.log(obj)
  })
})

describe('Auditing', () => {
  it('Add', async () => {
    await search.addAuditing('admin')
  })

  it('Check', async () => {
    const result = await search.checkAuditing('admin')
    console.log(result)
  })

  it('Remove', async () => {
    await search.removeAuditing('admin')
  })

  it('Check', async () => {
    const result = await search.checkAuditing('admin')
    console.log(result)
  })
})

import Search from '../built/lib/search.js'

import * as fs from 'fs'

const search = new Search()

async function n () {
  fs.appendFileSync('import.json', '{\n  data: [')

  let k: boolean = true

  for (let i = 0; k === true ; i = i + 10) {
    const result = await search.find('*', i)

    if (result.length < 10) {
      k = false
    }

    let data: string = '['

    for (let m = 0; m < result.length; m++) {
      data = data + `{username:"${result[m].username[0]}",title:"${result[m].title}",desc:"${result[m].desc?.replace(/\n/g, '\\n')}",members:"${result[m].members[0]}"}`
    }

    fs.appendFileSync('import.json', '\n    ')
    fs.appendFileSync('import.json', data + ']')
  }

  fs.appendFileSync('import.json', '\n  ]\n}')
}

n()

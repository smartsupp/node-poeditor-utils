import * as fs from 'fs'
import * as bluebird from 'bluebird'

export * from 'fs'
export const writeFileAsync = bluebird.promisify(fs.writeFile)

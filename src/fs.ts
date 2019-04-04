import * as fs from 'fs'
import * as util from 'util'

export * from 'fs'
export const writeFileAsync = util.promisify(fs.writeFile)

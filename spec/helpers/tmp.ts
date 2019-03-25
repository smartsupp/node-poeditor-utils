import * as fs from 'fs'

export const jasmineTmpPath = './spec/tmp'
fs.mkdirSync(jasmineTmpPath)

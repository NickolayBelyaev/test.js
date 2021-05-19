import fs from 'fs'
import dotenv from 'dotenv'
import { getDataChildrensAll } from '../data/Data'

dotenv.config()

module.exports.resultFileJSON = async function() {
  let fileName = process.env.FILE_NAME

  let res = await getDataChildrensAll()

  if (typeof fileName === 'string' && fileName.length>0) {
    let content = JSON.stringify(res)
    fs.writeFile(fileName, content, 'utf8', function (err) {
      if (err) {
          return console.log(err);
        }
    console.log(`Ok! The file ${fileName} was saved!`);
    });
  }
}
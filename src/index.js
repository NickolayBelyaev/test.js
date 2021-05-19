import { resultFileJSON } from './controller/resultFileJSON'
import { createTableDB, insertDataDB } from './controller/resultDB'
import commander from 'commander' 
const program = new commander.Command()

program
  .option('-f, --file', 'write data into file')
  .option('-a, --all', 'write data into file, create table in DB and insert data into table')
  .option('-t, --table', 'create table in DB and insert data into table')

program.parse(process.argv)

const options = program.opts();

async function result() {
if (options.all) {
  await resultFileJSON()
  await createTableDB()
  await insertDataDB()
}
if (options.file) resultFileJSON()
if (options.table) {
  await resultFileJSON()
  await createTableDB()
  await insertDataDB()
}
}  

result()

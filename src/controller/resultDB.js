import dotenv from 'dotenv'
import { query } from '../db'
import { getDataFirstRecord, getDataChildrensAll } from '../data/Data'

dotenv.config()

let myGlobalVars = {}
const typesJs2Postgres = {
  'number' :'int',
  'boolean':'bool',
  'string' :'varchar',
  'bigint' :'bigint',
  'object' :'jsonb'
}
const tableName = process.env.TABLE_NAME
myGlobalVars.typesJs2Postgres = typesJs2Postgres
myGlobalVars.tableName = tableName

async function tableStructe() {
  let dataStructure = {}

  let res = await getDataFirstRecord()

  for (let key in res.data) {
     dataStructure[key] = myGlobalVars.typesJs2Postgres[typeof(res.data)]
  }

  return dataStructure
}

module.exports.createTableDB = async function() {
  let structure = await tableStructe()
  let space = '   '

  let sqlCreateTable = `create table if not exists  ${myGlobalVars.tableName} (\n${space}_id int,\n`
  let beginfield = ',\n    '

  let nextField = false
  for (let key in  structure) {
     if (nextField) {
        sqlCreateTable += ',\n'
     } else {
        nextField = true
     }
     sqlCreateTable += `${space}${key} ${structure[key]}`
  }
  sqlCreateTable += `\n);\n`

  try {
    const { rows } = await query(sqlCreateTable)
    console.log(`Ok! Table ${myGlobalVars.tableName} created\n`)
  } catch(error) {
    console.log(error)
  }
}

module.exports.insertDataDB = async function() {
  let structure = {}
  let res = {}
  try {
	  res = await getDataChildrensAll()
    structure = await tableStructe()
  } catch(error) {
    console.log(`Error read data\n${error}`)
  }


  let sqlInsertData = `insert into ${myGlobalVars.tableName} values \n`
  let beginfield = ',\n    '
  let  isNextRecord = false

  for (let id in  res) {
    if  (isNextRecord) {
      sqlInsertData += '),\n'
    }
    sqlInsertData += `(${id}`
    for (let key in  structure) {
      if (key === 'callback') break
      let fieldData = res[id][key]
      if (typeof(fieldData) === 'undefined') {
        fieldData = 'null'
      }

      let str = ''        
      sqlInsertData += `${beginfield}` 

      switch (structure[key]) {
        case   'int': 
        case  'bigint':
        case  'bool':
            str = `${fieldData}`
            break
        case  'varchar':

            str = `${JSON.stringify(fieldData)}`
            str = str.slice(1, -1)
            str = str.replace(/\'/g, "''")
            str = `'${str}'`
            break
        case  'jsonb':
            str = `${JSON.stringify(fieldData)}`
            str = str.replace(/\'/g, "''")
            str = `'${str}'`
            break
      }
       sqlInsertData += `${str}`
    }
    isNextRecord = true
  }
  sqlInsertData += `)\n;`


   try {
      const { rows } = await query(sqlInsertData, '');
      console.log(`Ok! data inserted in table ${myGlobalVars.tableName}\n`)
    } catch(error) {
      console.log(`Error insert data into table ${myGlobalVars.tableName}\n${error}`)
    }
}
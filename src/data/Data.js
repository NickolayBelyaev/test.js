import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

module.exports.getDataFirstRecord  = async function () {
  try {
    let response = await fetch(`${process.env.DATA_URL_1}`)
    let data = await response.json()
    let ret = data.data.children[0]
    //console.log(ret)
    return  ret
   } catch(err) {
     console.log(err)
  }
}

async function getData(url,i) {
  try {
    let response = await fetch(url)
    let data = await response.json()
    let ch = data.data.children
    let ret = {}
    ch.forEach( data =>{
      ret[i++] = data.data
    })
    return  ret
   } catch(err) {
     console.log(err)
  }
}

module.exports.getDataChildrensAll = async function () {
    let after = ''
    let data = {}
     let ret = {}
    
    let sizeDate = 0 
    for (let i=0; i<10;i++) {
        data = await getData(`${process.env.DATA_URL}${after}`,sizeDate)
        Object.assign(ret,ret, data)
        let size = Object.keys(data).length
        if (size === 0) break
        sizeDate += size
        after += `&after=${data[sizeDate-1].name}`
    }
    return ret
}


//导入node.js内置的querystring模块
const qs = require('querystring')

const bodyParser = (req,res,next) =>{
    let str = ''
    //监听req.data事件
    req.on('data',(chunk) =>{
        str+=chunk
    })

    //监听req.end事件
    req.on('end',()=>{
        const body = qs.parse(str)
        req.body = body
        console.log(req.body)
        next()
    })
}

module.exports =bodyParser
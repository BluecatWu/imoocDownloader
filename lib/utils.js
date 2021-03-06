'use strict'

let fs = require('fs'),
    os = require('os'),
    path = require('path'),
    debug = require('debug'),
    config = require('../config'),
    type = os.type();
    


/*
 * @检查文件夹是否存在
 * @params 文件夹路径{String} 
 * @支持绝对路径/相对路径
 */
exports.checkFolder = function(p,cb){
    let pa = null,
        ps = '';
        
    if(!path.isAbsolute(p)){
        p = path.resolve(config.rootDir,p);
    }
    if(type == 'Windows_NT'){
        pa = p.replace(/\//g,'\\').split('\\');
        for(let i=0;i<pa.length;i++){
            ps += pa[i];
            ps += '\\';
            if(!fs.existsSync(ps)){
                fs.mkdirSync(ps);
            } 
        } 
    }else{
        pa = p.split('/').slice(1);
        for(let i=0;i<pa.length;i++){
            ps += '/';
            ps += pa[i];
            if(!fs.existsSync(ps)){
                fs.mkdirSync(ps);
            } 
        } 
    }
    cb && cb();
    return ps;
}

/*
 * 同步检查文件
 * @param {String} 文件路径
 *
 */

exports.checkFileSync = function(p){
    let f = fs.existsSync(p);
    if(!f){
        return null;
    }else{
        return fs.statSync(p);
    }
}

/*
 * 异步检查文件
 * @param {String} 文件路径
 *
 */

exports.checkFileAsync = function(p){
    let promise = new Promise(function(resolve,reject){
        fs.exists(p,function(exist){
            if(!exist){
                resolve(null);
            }else{
                fs.stat(p,function(err,stats){
                    if(!err){
                        resolve(stats);
                    }
                })
            }
        })
    })
    return promise;
}


/*
 * 去除字符串前后空格
 * @param str {string} 待处理字符串
 * @return string
 */
exports.trim = function(str){
    return str.replace(/(^\s*)?(\s*$)?/g,'');
}


/*
 * 替换命名规范不支持字符
 * @param str {string} 待处理字符串
 * @return string
 */
exports.noneDiagonal = function(str){
    return str.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g,'&');
}


/*
 * 拼接生成新路径格式字符串  (hello,world) => hello/world 
 * @param {string} 待拼接字符串
 * @return string
 */
exports.concatPath = function(){
    let args = Array.from(arguments);
    if(os.type())
    return args.reduce((p,c) => p + '/' + c);
}
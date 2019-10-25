const fs = require('fs-extra')
const path = require('path')
const cjs = require('crypto-ts')

VALIDKEYS = ["myh4sh", "c0mpl1c4t3dh45h", "4h4s5hm05tc0mpl1c4t3dth4npr3v"]

let Enc = async (data, opt) => {
    let losdatos = await cjs.AES.encrypt(JSON.stringify(data), VALIDKEYS[opt]).toString();
    return losdatos
}

// let Dec = async (data, opt) => {
//     let bytes = await cjs.AES.decrypt(data.toString(), VALIDKEYS[opt]);
//     return JSON.parse(bytes.toString(cjs.enc.Utf8));
// }

let GenerateFile = async (date, opt, auth) => {
    if(date && date.split('/').length == 3) {
        let m = parseInt(date.split('/')[0])
        let d = parseInt(date.split('/')[1])
        let y = parseInt(date.split('/')[2])

        if(y%1 != 0 || d%1 != 0 || m%1 != 0 || m > 12 || d > 31 || y < 2019)
            return false
        else {
            try {
                let elpath = path.join(process.cwd(),'authorization.key')
                if(!fs.existsSync(elpath)) {
                    fs.ensureFileSync(elpath)
                }
                let data = {
                    date,
                    auth,
                    opt
                }
                let Data = await Enc(data, opt)
                fs.writeFileSync(path.resolve(elpath), Data)
                if(fs.existsSync(elpath)) {
                    let aquitan = fs.readFileSync(elpath, 'utf-8')
                    if(typeof aquitan == 'string')
                        return true
                    else
                        return false
                }
                else
                    return false
            } catch (e) {
                // console.log(e)
                return false
            }
        }
    }
    else
        return false
}

module.exports =  GenerateFile
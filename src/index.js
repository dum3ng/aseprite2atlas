// @ts-check
const fsp = require('fs/promises')
const path = require('path')

function array2plist() {}

function kv2plist(kv) {
    return `<>`
}

function value2plist(v) {
    switch (typeof v) {
        case 'number': {
            if (Number.isInteger(v)) {
                return `<integer>${v}</integer>`
            } else {
                return `<real>${v}</real>`
            }
        }
        case 'string': {
            return `<string>${v}</string>`
        }
        case 'boolean': {
            return `<${v} />`
        }
        case 'object': {
            return `${obj2plist(v)}`
        }
    }
}

function obj2plist(obj) {
    let str = ''
    str += '<dict>'
    for (let k in obj) {
        const v = obj[k]
        const keyStr = `<key>${k}</key>`
        const vStr = value2plist(v)
        str += keyStr + '\n' + vStr + '\n'
    }
    str += '</dict>'
    return str
}

function json2plist(json) {
    return `
  <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
${obj2plist(json)}
</plist>
`
}

async function main() {
    const filename = process.argv[2]
    const title = path.basename(filename, '.json')
    const file = title + '.png'

    const str = await fsp.readFile(filename, { encoding: 'utf8' })
    /**
     * @type AspriteSpriteFrame
     */
    const json = JSON.parse(str)

    /**
     * @type PList
     */
    const data = {}
    data.metadata = {}
    data.metadata.size = `{${json.meta.size.w}, ${json.meta.size.h}}`
    data.metadata.textureFileName = file
    data.metadata.realTextureFileName = file
    data.metadata.format = 3
    data.metadata.pixelFormat = `RGBA8888`
    data.metadata.premultiplyAlpha = false
    data.frames = {}
    for (const k in json.frames) {
        const value = json.frames[k]
        const frame = value.frame
        data.frames[k] = {
            spriteSize: `{${value.sourceSize.w}, ${value.sourceSize.h}}`,
            spriteOffset: `{${value.spriteSourceSize.x}, ${value.spriteSourceSize.y}}`,
            spriteSourceSize: `{${value.spriteSourceSize.w}, ${value.spriteSourceSize.h}}`,
            textureRect: `{{${frame.x}, ${frame.y}}, {${frame.w}, ${frame.h}}}`,
            textureRotated: value.rotated,
        }
    }
    const plist = json2plist(data)
    fsp.writeFile(
        path.resolve(path.dirname(filename), title + '.plist'),
        plist,
        {
            encoding: 'utf-8',
        },
    )
}

main()

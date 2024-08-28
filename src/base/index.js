// @ts-check
const fsp = require('fs/promises')
const path = require('path')

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
      textureRotated: value.rotated
    }
  }
  const plist = json2plist(data)
  fsp.writeFile(path.resolve(path.dirname(filename), title + '.plist'), plist, {
    encoding: 'utf-8'
  })
}

main()

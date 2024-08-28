/**
 * convert aseprite data file to cocos sprite sheet atlas format
 */
export interface AspriteSpriteFrame {
  frames: {
    [key: string]: {
      frame: { x: number; y: number; w: number; h: number }
      rotated: boolean
      trimmed: boolean
      spriteSourceSize: { x: number; y: number; w: number; h: number }
      sourceSize: { w: number; h: number }
    }
  }
  meta: {
    size: { w: number; h: number }
  }
}

type Coord = string

export interface PList {
  frames: {
    [key: string]: {
      spriteOffset: `{${number}, ${number}}`
      spriteSize: `{${number}, ${number}}`
      spriteSourceSize: `{${number}, ${number}}`
      textureRect: `{${Coord}, ${Coord}}`
      textureRotated: boolean
    }
  }
  metadata: {
    size: Coord
    textureFileName: string
    realTextureFileName: string
    format: number
    pixelFormat: string
    premultiplyAlpha: boolean
  }
}

function value2plist(v: any) {
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

function obj2plist(obj: any) {
  let str = ''
  str += '<dict>'
  for (const k in obj) {
    const v = obj[k]
    const keyStr = `<key>${k}</key>`
    const vStr = value2plist(v)
    str += keyStr + '\n' + vStr + '\n'
  }
  str += '</dict>'
  return str
}

export function json2plist(json: object) {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  ${obj2plist(json)}
</plist>
`
}

export function convert(str: string, filename: string) {
  const json: AspriteSpriteFrame = JSON.parse(str)

  const data: PList = {
    frames: {},
    metadata: {
      size: '',
      textureFileName: '',
      realTextureFileName: '',
      format: 0,
      pixelFormat: '',
      premultiplyAlpha: false
    }
  }
  data.metadata.size = `{${json.meta.size.w}, ${json.meta.size.h}}`
  data.metadata.textureFileName = filename
  data.metadata.realTextureFileName = filename
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
  return plist
}

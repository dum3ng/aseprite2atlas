interface AspriteSpriteFrame {
    frames: {
        [string]: {
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
interface PList {
    frames: {
        [string]: {
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

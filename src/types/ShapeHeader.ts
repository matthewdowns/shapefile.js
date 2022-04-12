import { ShapeType } from './enums'
import ShapeBoundingBox from './ShapeBoundingBox'

interface ShapeHeader {
  file: {
    code: number
    length: number
  }
  version: number
  type: ShapeType
  boundingBox: ShapeBoundingBox
  range: {
    minZ: number
    maxZ: number
    minM: number
    maxM: number
  }
}

export default ShapeHeader

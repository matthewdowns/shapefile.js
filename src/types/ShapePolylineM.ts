import ShapeBoundingBox from './ShapeBoundingBox'
import ShapePoint from './ShapePoint'

interface ShapePolylineM {
  boundingBox: ShapeBoundingBox
  numberOfParts: number
  numberOfPoints: number
  parts: number[]
  points: ShapePoint[]
  range: {
    minM: number
    maxM: number
  }
  measures: number[]
}

export default ShapePolylineM

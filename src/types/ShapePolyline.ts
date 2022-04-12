import ShapeBoundingBox from './ShapeBoundingBox'
import ShapePoint from './ShapePoint'

interface ShapePolyline {
  boundingBox: ShapeBoundingBox
  numberOfParts: number
  numberOfPoints: number
  parts: number[]
  points: ShapePoint[]
}

export default ShapePolyline

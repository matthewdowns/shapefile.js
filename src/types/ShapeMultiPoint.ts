import ShapeBoundingBox from './ShapeBoundingBox'
import ShapePoint from './ShapePoint'

interface ShapeMultiPoint {
  boundingBox: ShapeBoundingBox
  numberOfPoints: number
  points: ShapePoint[]
}

export default ShapeMultiPoint

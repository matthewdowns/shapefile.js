import ShapeBoundingBox from './ShapeBoundingBox'

interface ShapePolygon {
  boundingBox: ShapeBoundingBox

  /**
     * The number of rings in the polygon
     */
  numberOfParts: number

  /**
     * The total number of points for all rings
     */
  numberOfPoints: number

  parts: number[]

  points: number[]
}

export default ShapePolygon

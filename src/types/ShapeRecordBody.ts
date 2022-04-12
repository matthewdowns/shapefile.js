import { ShapeType } from './enums'
import ShapeMultiPoint from './ShapeMultiPoint'
import ShapePoint from './ShapePoint'
import ShapePolygon from './ShapePolygon'
import ShapePolyline from './ShapePolyline'

interface ShapeRecordBody<TType extends ShapeType> {
  type: TType
  data:
  TType extends ShapeType.Point ? ShapePoint :
    TType extends ShapeType.Polyline ? ShapePolyline :
      TType extends ShapeType.Polygon ? ShapePolygon :
        TType extends ShapeType.MultiPoint ? ShapeMultiPoint :
          null
}

export default ShapeRecordBody

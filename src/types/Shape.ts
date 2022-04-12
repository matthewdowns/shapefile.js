import { ShapeType } from './enums'
import ShapeHeader from './ShapeHeader'
import ShapeRecord from './ShapeRecord'

interface Shape {
  header: ShapeHeader
  records: Array<ShapeRecord<ShapeType>>
}

export default Shape

import { ShapeType } from './enums'
import ShapeRecordBody from './ShapeRecordBody'
import ShapeRecordHeader from './ShapeRecordHeader'

interface ShapeRecord<TType extends ShapeType> {
  header: ShapeRecordHeader
  body: ShapeRecordBody<TType>
}

export default ShapeRecord

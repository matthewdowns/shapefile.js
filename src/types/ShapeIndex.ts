import ShapeHeader from './ShapeHeader'
import ShapeIndexRecord from './ShapeIndexRecord'

interface ShapeIndex {
  header: ShapeHeader
  records: ShapeIndexRecord[]
}

export default ShapeIndex

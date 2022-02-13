import { ShapeType } from './enums';
import ShapeRecordBody from './ShapeRecordBody';
import ShapeRecordHeader from './ShapeRecordHeader';

type ShapeRecord<TType extends ShapeType> = {
    header: ShapeRecordHeader;
    body: ShapeRecordBody<TType>;
}

export default ShapeRecord;
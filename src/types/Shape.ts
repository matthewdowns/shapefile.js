import { ShapeType } from './enums';
import ShapeHeader from './ShapeHeader';
import ShapeRecord from './ShapeRecord';

type Shape = {
    header: ShapeHeader;
    records: ShapeRecord<ShapeType>[];
}

export default Shape;

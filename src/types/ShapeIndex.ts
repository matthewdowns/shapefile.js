import ShapeHeader from './ShapeHeader';
import ShapeIndexRecord from './ShapeIndexRecord';

type ShapeIndex = {
    header: ShapeHeader;
    records: ShapeIndexRecord[];
}

export default ShapeIndex;
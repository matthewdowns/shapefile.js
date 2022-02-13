import ShapeBoundingBox from './ShapeBoundingBox';
import ShapePoint from './ShapePoint';

type ShapeMultiPoint = {
    boundingBox: ShapeBoundingBox;
    numberOfPoints: number;
    points: ShapePoint[];
}

export default ShapeMultiPoint;
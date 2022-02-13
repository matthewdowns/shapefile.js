import ShapeBoundingBox from './ShapeBoundingBox';
import ShapePoint from "./ShapePoint";

type ShapePolyline = {
    boundingBox: ShapeBoundingBox;
    numberOfParts: number;
    numberOfPoints: number;
    parts: number[];
    points: ShapePoint[];
}

export default ShapePolyline;
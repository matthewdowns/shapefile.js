import ShapeBoundingBox from './ShapeBoundingBox';
import ShapePoint from "./ShapePoint";

type ShapePolylineZ = {
    boundingBox: ShapeBoundingBox;
    numberOfParts: number;
    numberOfPoints: number;
    parts: number[];
    points: ShapePoint[];
    range: {
        minZ: number;
        maxZ: number;
        minM: number;
        maxM: number;
    };
    measures: number[];
}

export default ShapePolylineZ;

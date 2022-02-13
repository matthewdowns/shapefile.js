import {
    Shape,
    ShapeBoundingBox,
    ShapeHeader,
    ShapeMultiPoint,
    ShapePoint,
    ShapePointZ,
    ShapePolygon,
    ShapePolyline,
    ShapeRecord,
    ShapeRecordBody,
    ShapeRecordHeader,
    ShapeType
} from "../../../types";

function shp(buffer: ArrayBuffer): Shape {
    const header = getHeader(buffer.slice(0, 100));
    const records = getRecords(buffer.slice(100, buffer.byteLength));

    return {
        header,
        records
    }
}

function getHeader(arrayBuffer: ArrayBuffer): ShapeHeader {
    const dv = new DataView(arrayBuffer);
    return {
        file: {
            code: dv.getInt32(0, false),
            length: dv.getInt32(24, false)
        },
        version: dv.getInt32(28, true),
        type: dv.getInt32(32, true),
        boundingBox: {
            minX: dv.getFloat64(36, true),
            minY: dv.getFloat64(44, true),
            maxX: dv.getFloat64(52, true),
            maxY: dv.getFloat64(60, true)
        },
        range: {
            minZ: dv.getFloat64(68, true),
            maxZ: dv.getFloat64(76, true),
            minM: dv.getFloat64(84, true),
            maxM: dv.getFloat64(92, true)
        }
    };
}

function getRecords(arrayBuffer: ArrayBuffer): ShapeRecord<ShapeType>[] {
    const dv = new DataView(arrayBuffer);

    let bp = 0;
    const records: ShapeRecord<ShapeType>[] = [];
    do {
        const header: ShapeRecordHeader = {
            number: dv.getInt32(0, false),
            length: dv.getInt32(4, false)
        };
        bp += 8;

        const type = dv.getInt32(bp, true);
        bp += 4;

        let data: ShapeRecordBody<ShapeType>['data'];

        switch (type) {
            case ShapeType.Null:
                data = null;
                break;
            case ShapeType.Point: {
                data = getPoint(arrayBuffer.slice(bp, bp + 16));
                bp += 16;
                break;
            }
            case ShapeType.Polyline:
            case ShapeType.Polygon: {
                const boundingBox = getBoundingBox(arrayBuffer.slice(bp, bp + 32));
                const numberOfParts = dv.getInt32(bp + 32, true);
                const numberOfPoints = dv.getInt32(bp + 36, true);
                bp += 40;
                const parts: number[] = [];
                for (let i = 0; i < numberOfParts; i++) {
                    const part = dv.getInt32(bp, true);
                    parts.push(part);
                    bp += 4;
                }
                const points: ShapePoint[] = [];
                for (let i = 0; i < numberOfPoints; i++) {
                    points.push(getPoint(arrayBuffer.slice(bp, bp + 16)));
                    bp += 16;
                }
                data = {
                    boundingBox,
                    numberOfParts,
                    numberOfPoints,
                    parts,
                    points
                } as ShapePolyline | ShapePolygon;
                break;
            }
            case ShapeType.MultiPoint: {
                const boundingBox = getBoundingBox(arrayBuffer.slice(bp, bp + 32));
                const numberOfPoints = dv.getInt32(bp + 32, true);
                bp += 36;
                const points: ShapePoint[] = [];
                for (let i = 0; i < numberOfPoints; i++) {
                    points.push(getPoint(arrayBuffer.slice(bp, bp + 16)));
                    bp += 16;
                }
                data = {
                    boundingBox,
                    numberOfPoints,
                    points
                } as ShapeMultiPoint;
                break;
            }
            case ShapeType.PointZ: {
                data = getPoint(arrayBuffer.slice(bp, bp + 32), 'Z');
                bp += 32;
                break;
            }
            default:
                throw new Error(type.toString());
        }

        records.push({
            header,
            body: {
                type,
                data
            }
        });
    } while (bp < dv.byteLength);

    return records;
}

function getBoundingBox(arrayBuffer: ArrayBuffer): ShapeBoundingBox {
    const dv = new DataView(arrayBuffer);
    return {
        minX: dv.getFloat64(0, true),
        minY: dv.getFloat64(8, true),
        maxX: dv.getFloat64(16, true),
        maxY: dv.getFloat64(24, true)
    }
}

function getPoint(arrayBuffer: ArrayBuffer): ShapePoint;
function getPoint(arrayBuffer: ArrayBuffer, as: 'M'): ShapePointZ;
function getPoint(arrayBuffer: ArrayBuffer, as: 'Z'): ShapePointZ;
function getPoint(arrayBuffer: ArrayBuffer, as?: 'M' | 'Z'): ShapePoint | ShapePointZ {
    const dv = new DataView(arrayBuffer);
    return {
        x: dv.getFloat64(0, true),
        y: dv.getFloat64(8, true),
        z: as === 'Z' ? dv.getFloat64(16, true) : undefined,
        measure: as === 'M' ? dv.getFloat64(16, true) : as === 'Z' ? dv.getFloat64(24, true) : undefined
    }
}

export default shp;
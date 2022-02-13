import {
    ShapeHeader,
    ShapeIndex,
    ShapeIndexRecord
} from "../../../types";

function shx(buffer: ArrayBuffer): ShapeIndex {
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

function getRecords(arrayBuffer: ArrayBuffer): ShapeIndexRecord[] {
    const dv = new DataView(arrayBuffer);

    let bp = 0;
    const records: ShapeIndexRecord[] = [];
    do {
        const offset = dv.getInt32(bp, false);
        bp += 4;

        const length = dv.getInt32(bp, false);
        bp += 4;

        records.push({
            offset,
            length
        });
    } while (bp < dv.byteLength);

    return records;
}

export default shx;
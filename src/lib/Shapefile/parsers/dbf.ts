import moment from 'moment-timezone';
import {
    Dbase,
    DbaseHeader,
    DbaseField,
    DbaseFieldProperty,
    DbaseVersion
} from '../../../types';

function dbf(arrayBuffer: ArrayBuffer, timezone = 'UTC', properties: boolean): Dbase<DbaseVersion, typeof properties> {
    const array = new Uint8Array(arrayBuffer);
    const dv = new DataView(arrayBuffer);

    const version = array[0] as DbaseVersion;
    const year = 1900 + array[1];
    const month = array[2];
    const date = array[3];
    const lastUpdated = moment.tz(`${year}-${month}-${date}`, 'YYYY-MM-DD', timezone).toDate();
    const numberOfRecords = dv.getUint32(4, true);
    const numberOfBytesInHeader = dv.getUint16(8, true);
    const numberOfBytesInRecord = dv.getUint16(10, true);
    const languageDriver = version === DbaseVersion.Level7 ? {
        id: array[29],
        name: Buffer.from(array.slice(32, 64)).toString('utf-8').trim()
    } : undefined;

    const header: DbaseHeader<DbaseVersion> = {
        version,
        lastUpdated,
        numberOfRecords,
        numberOfBytesInHeader,
        numberOfBytesInRecord,
        languageDriver
    };
    const fields = getFields(
        new Uint8Array(arrayBuffer.slice(version === DbaseVersion.Level5
            ? 32 : 68,
            arrayBuffer.byteLength)),
        header.version,
        properties,
        timezone);

    return {
        header,
        fields
    };
}

function getFields(array: Uint8Array, version: DbaseVersion, properties: boolean, timezone: string): DbaseField<typeof version, typeof properties>[] {
    let size: number;
    switch (version) {
        case DbaseVersion.Level5:
            size = 32;
            break;
        case DbaseVersion.Level7:
            size = 48;
            break;
    }

    const fields: DbaseField<typeof version, typeof properties>[] = [];
    let bp = 0;
    let terminated = false;
    do {
        const terminator = array[bp];
        if (terminator === 0x0D) terminated = true;
        else {
            fields.push(getField(array.slice(bp, bp + size), version, properties));
            bp += size;
        }
    } while (!terminated);
    bp += 1;

    if (properties) {
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const valueRaw = Buffer.from(array.slice(bp, bp + field.length)).toString('utf-8').trim();
            let value: any;
            switch (field.type) {
                case 'C':
                    value = valueRaw;
                    break;
                case 'F':
                    value = parseFloat(valueRaw);
                    break;
                case 'L': {
                    value =
                        (['Y', 'y', 'T', 't'].includes(valueRaw)) ? true :
                        (['N', 'n', 'F', 'f'].includes(valueRaw)) ? false :
                        null;
                    break;
                }
                case 'M':
                    value = valueRaw;
                    break;
                case 'N':
                    value = parseFloat(valueRaw);
            }
            bp += field.length;
            console.log([field, valueRaw, value])
        }
    }

    return fields;
}

function getField(arrayBuffer: ArrayBuffer, version: DbaseVersion, properties: boolean): DbaseField<typeof version, typeof properties> {
    const array = new Uint8Array(arrayBuffer);

    switch (version) {
        case DbaseVersion.Level5: {
            const name = Buffer.from(array.slice(0, 11)).toString('utf-8').replace(/[\u0000]+$/, '');
            const type = Buffer.from(array.slice(11, 12)).toString('utf-8');
            const length = array[16];
            const decimals = array[17];
            const field: DbaseField<DbaseVersion.Level5, typeof properties> = {
                name,
                type,
                length,
                decimals,
                properties: undefined
            };
            return field;
        }
        case DbaseVersion.Level7: {
            const name = Buffer.from(array.slice(0, 32).filter(n => n)).toString('utf-8').trim();
            const type = Buffer.from(array.slice(32, 33).filter(n => n)).toString('utf-8').trim();
            const length = array[33];
            const decimals = array[34];
            const autoincrement = Buffer.from(array.slice(40, 44)).readIntLE(0, 4) || undefined;
            const field: DbaseField<DbaseVersion.Level7, typeof properties> = {
                name,
                type,
                length,
                decimals,
                autoincrement,
                properties: undefined
            };
            return field;
        }
    }
}

export default dbf;

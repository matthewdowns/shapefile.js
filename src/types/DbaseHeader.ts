import { DbaseVersion } from './enums';

type DbaseHeader<TVersion extends DbaseVersion> = {
    version: TVersion;
    lastUpdated: Date;
    numberOfRecords: number;
    numberOfBytesInHeader: number;
    numberOfBytesInRecord: number;
    languageDriver: TVersion extends DbaseVersion.Level5 ? undefined : {
        id: number;
        name: string;
    }
}

export default DbaseHeader;

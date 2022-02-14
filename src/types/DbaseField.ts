import { DbaseVersion } from './enums';
import DbaseFieldProperty from './DbaseFieldProperty';

type DbaseField<TVersion extends DbaseVersion, TProperties extends boolean> = {
    name: string;
    type: string;
    length: number;
    decimals: number;
    autoincrement?: TVersion extends DbaseVersion.Level5 ? never : number;
    properties: TProperties extends true ? DbaseFieldProperty[] : undefined;
}

export default DbaseField;

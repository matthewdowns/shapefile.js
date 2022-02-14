import { DbaseVersion } from './enums';
import DbaseField from './DbaseField';
import DbaseHeader from './DbaseHeader';

type Dbase<TVersion extends DbaseVersion, TProperties extends boolean> = {
    header: DbaseHeader<TVersion>;
    fields: DbaseField<TVersion, TProperties>[];
}

export default Dbase;

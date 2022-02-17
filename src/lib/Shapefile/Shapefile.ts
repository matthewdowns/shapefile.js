import {
    Dbase,
    DbaseVersion,
    Shape,
    ShapeIndex
} from '../../types';
import * as parsers from './parsers';
import { DbfOptions } from './parsers/dbf';
import { ShapefileContents } from './Shapefile.types';

class Shapefile {
    public readonly contents: ShapefileContents;

    constructor(contents: ShapefileContents) {
        this.contents = contents;
    }

    public parse(key: 'shp'): Shape;
    public parse(key: 'shx'): ShapeIndex;
    public parse(key: 'dbf', options: DbfOptions): Dbase<DbaseVersion, typeof options.properties>;
    public parse(key: keyof ShapefileContents, ...args: any) {
        switch (key) {
            case 'shp':
                return parsers.shp(this.contents.shp.buffer);
            case 'shx':
                return parsers.shx(this.contents.shx.buffer);
            case 'dbf':
                return parsers.dbf(this.contents.dbf.buffer, args[0]);
        }

        return undefined;
    }
}

export default Shapefile;

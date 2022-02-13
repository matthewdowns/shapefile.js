import {
    ShapefileContents
} from './Shapefile.types';
import * as parsers from './parsers';
import { Shape, ShapeIndex } from '../../types';

class Shapefile {
    public readonly contents: ShapefileContents;

    constructor(contents: ShapefileContents) {
        this.contents = contents;
    }

    public parse(key: 'shp'): Shape;
    public parse(key: 'shx'): ShapeIndex;
    public parse(key: keyof ShapefileContents) {
        switch (key) {
            case 'shp':
                return parsers.shp(this.contents.shp.buffer);
            case 'shx':
                return parsers.shx(this.contents.shx.buffer);
        }

        return undefined;
    }
}

export default Shapefile;
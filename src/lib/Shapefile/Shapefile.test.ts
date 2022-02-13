import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { ShapePolygon } from '../../types';
import Shapefile from './Shapefile';
import { load } from './Shapefile.functions';

const testsDir = resolve(__dirname, '../../../tests');
const USA_adm = readFileSync(join(testsDir, 'USA_adm.zip'));

describe('Shapefile', () => {
    let shapefiles: Record<string, Shapefile>;
    let USA_adm0: Shapefile;

    beforeAll(async () => {
        shapefiles = await load(USA_adm, true);
        USA_adm0 = shapefiles['USA_adm0'];
    });

    test('load', async () => {
        expect(USA_adm0).toBeDefined();
        expect(USA_adm0.contents.shp).toBeDefined();
        expect(USA_adm0.contents.shx).toBeDefined();
        expect(USA_adm0.contents.dbf).toBeDefined();
        expect(USA_adm0.contents.prj).toBeDefined();
        expect(USA_adm0.contents.sbn).toBeUndefined();
        expect(USA_adm0.contents.fbn).toBeUndefined();
        expect(USA_adm0.contents.ain).toBeUndefined();
        expect(USA_adm0.contents.ixs).toBeUndefined();
        expect(USA_adm0.contents.mxs).toBeUndefined();
        expect(USA_adm0.contents.atx).toBeUndefined();
        expect(USA_adm0.contents.shpxml).toBeUndefined();
        expect(USA_adm0.contents.cpg).toBeDefined();
        expect(USA_adm0.contents.qix).toBeUndefined();
    });

    describe('parsers', () => {
        test('shp', async () => {
            const parsed = USA_adm0.parse('shp');
            expect(parsed.header.file.code).toBe(9994);
            expect(parsed.header.file.length).toBe(16511606);
            expect(parsed.header.type).toBe(5);
            expect(parsed.header.boundingBox.minX).toBe(-179.15055847167946);
            expect(parsed.header.boundingBox.minY).toBe(18.909858703613565);
            expect(parsed.header.boundingBox.maxX).toBe(179.77340698242222);
            expect(parsed.header.boundingBox.maxY).toBe(72.68750000000043);
            expect(parsed.header.range.minZ).toBe(0);
            expect(parsed.header.range.maxZ).toBe(0);
            expect(parsed.header.range.minM).toBe(0);
            expect(parsed.header.range.maxM).toBe(0);
            expect(parsed.records.length).toBe(1);
            expect(parsed.records[0].header.number).toBe(1);
            expect(parsed.records[0].body.type).toBe(5);
            expect((parsed.records[0].body.data as ShapePolygon).boundingBox.minX).toBe(-179.15055847167946);
            expect((parsed.records[0].body.data as ShapePolygon).boundingBox.minY).toBe(18.909858703613565);
            expect((parsed.records[0].body.data as ShapePolygon).boundingBox.maxX).toBe(179.77340698242222);
            expect((parsed.records[0].body.data as ShapePolygon).boundingBox.maxY).toBe(72.68750000000043);
            expect((parsed.records[0].body.data as ShapePolygon).numberOfParts).toBe(8437);
            expect((parsed.records[0].body.data as ShapePolygon).numberOfPoints).toBe(2061832);
            expect((parsed.records[0].body.data as ShapePolygon).parts.length).toBe(8437);
            expect((parsed.records[0].body.data as ShapePolygon).points.length).toBe(2061832);
        });

        test('shx', async () => {
            const parsed = USA_adm0.parse('shx');
            expect(parsed.header.file.code).toBe(9994);
            expect(parsed.header.file.length).toBe(54);
            expect(parsed.header.type).toBe(5);
            expect(parsed.header.boundingBox.minX).toBe(-179.15055847167946);
            expect(parsed.header.boundingBox.minY).toBe(18.909858703613565);
            expect(parsed.header.boundingBox.maxX).toBe(179.77340698242222);
            expect(parsed.header.boundingBox.maxY).toBe(72.68750000000043);
            expect(parsed.header.range.minZ).toBe(0);
            expect(parsed.header.range.maxZ).toBe(0);
            expect(parsed.header.range.minM).toBe(0);
            expect(parsed.header.range.maxM).toBe(0);
            expect(parsed.records.length).toBe(1);
            expect(parsed.records[0].offset).toBe(50);
            expect(parsed.records[0].length).toBe(16511552);
        });
    })
});
import { readFileSync } from 'fs';
import moment from 'moment';
import { join, resolve } from 'path';
import { ShapePolygon } from '../../types';
import Shapefile from './Shapefile';
import { load } from './Shapefile.functions';

const testsDir = resolve(__dirname, '../../../tests');
const USA_adm = readFileSync(join(testsDir, 'USA_adm.zip'));

describe('Shapefile', () => {
    let USA_adm1: Shapefile;

    test('load', async () => {
        USA_adm1 = (await load(USA_adm, true))['USA_adm1'];
        expect(USA_adm1).toBeDefined();
        expect(USA_adm1.contents.shp).toBeDefined();
        expect(USA_adm1.contents.shx).toBeDefined();
        expect(USA_adm1.contents.dbf).toBeDefined();
        expect(USA_adm1.contents.prj).toBeDefined();
        expect(USA_adm1.contents.sbn).toBeUndefined();
        expect(USA_adm1.contents.fbn).toBeUndefined();
        expect(USA_adm1.contents.ain).toBeUndefined();
        expect(USA_adm1.contents.ixs).toBeUndefined();
        expect(USA_adm1.contents.mxs).toBeUndefined();
        expect(USA_adm1.contents.atx).toBeUndefined();
        expect(USA_adm1.contents.shpxml).toBeUndefined();
        expect(USA_adm1.contents.cpg).toBeDefined();
        expect(USA_adm1.contents.qix).toBeUndefined();
    });

    describe('parsers', () => {
        test.skip('shp', async () => {
            const parsed = USA_adm1.parse('shp');
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

        test.skip('shx', async () => {
            const parsed = USA_adm1.parse('shx');
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

        test('dbf', () => {
            const parsed = USA_adm1.parse('dbf', 'UTC', true);
            expect(parsed.header.version).toBe(3);
            expect(parsed.header.lastUpdated.toISOString()).toBe(moment.utc('2015-08-11 00:00:00').toISOString());
            expect(parsed.header.numberOfRecords).toBe(52);
            expect(parsed.header.numberOfBytesInHeader).toBe(321);
            expect(parsed.header.numberOfBytesInRecord).toBe(474);
            expect(parsed.header.languageDriver).toBeUndefined();
            expect(parsed.fields.length).toBe(9);
        });
    });
});

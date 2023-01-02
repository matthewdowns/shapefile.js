import { readFileSync } from 'fs'
import moment from 'moment'
import { join, resolve } from 'path'
import { DbaseVersion, ShapePolygon } from '../../types'
import Shapefile from './Shapefile'

const testsDir = resolve(__dirname, '../../../tests')
const USA_adm = readFileSync(join(testsDir, 'USA_adm.zip'))

describe('Shapefile', () => {
  describe('USA_adm', () => {
    let USA_adm1: Shapefile

    beforeAll(async () => {
      // The .zip file being loaded contains 3 "groups":
      // USA_adm0, USA_adm1, and USA_adm2
      const shapefiles = await Shapefile.load(USA_adm)
      expect(Object.keys(shapefiles).length).toBe(3)

      // For testing, we will use USA_adm1
      USA_adm1 = shapefiles['USA_adm1']
      expect(USA_adm1).toBeDefined()
      expect(USA_adm1.contents.shp).toBeDefined()
      expect(USA_adm1.contents.shx).toBeDefined()
      expect(USA_adm1.contents.dbf).toBeDefined()
      expect(USA_adm1.contents.prj).toBeDefined()
      expect(USA_adm1.contents.sbn).toBeUndefined()
      expect(USA_adm1.contents.fbn).toBeUndefined()
      expect(USA_adm1.contents.ain).toBeUndefined()
      expect(USA_adm1.contents.ixs).toBeUndefined()
      expect(USA_adm1.contents.mxs).toBeUndefined()
      expect(USA_adm1.contents.atx).toBeUndefined()
      expect(USA_adm1.contents.shpxml).toBeUndefined()
      expect(USA_adm1.contents.cpg).toBeDefined()
      expect(USA_adm1.contents.qix).toBeUndefined()
    })

    test('shp', async () => {
      const shp = USA_adm1.parse('shp')
      expect(shp.header.file.code).toBe(9994)
      expect(shp.header.file.length).toBe(17164452)
      expect(shp.header.type).toBe(5)
      expect(shp.header.boundingBox.minX).toBe(-179.15055847167963)
      expect(shp.header.boundingBox.minY).toBe(18.909858703613395)
      expect(shp.header.boundingBox.maxX).toBe(179.77340698242205)
      expect(shp.header.boundingBox.maxY).toBe(72.68750000000004)
      expect(shp.header.range.minZ).toBe(0)
      expect(shp.header.range.maxZ).toBe(0)
      expect(shp.header.range.minM).toBe(0)
      expect(shp.header.range.maxM).toBe(0)
      expect(shp.records.length).toBe(52)
      expect(shp.records[0].header.number).toBe(1)
      expect(shp.records[0].body.type).toBe(5)
      expect((shp.records[0].body.data as ShapePolygon).boundingBox.minX).toBe(-88.47203063964844)
      expect((shp.records[0].body.data as ShapePolygon).boundingBox.minY).toBe(30.217247009277287)
      expect((shp.records[0].body.data as ShapePolygon).boundingBox.maxX).toBe(-84.89348602294923)
      expect((shp.records[0].body.data as ShapePolygon).boundingBox.maxY).toBe(35.00888061523449)
      expect((shp.records[0].body.data as ShapePolygon).numberOfParts).toBe(23)
      expect((shp.records[0].body.data as ShapePolygon).numberOfPoints).toBe(11029)
      expect((shp.records[0].body.data as ShapePolygon).parts.length).toBe(23)
      expect((shp.records[0].body.data as ShapePolygon).points.length).toBe(11029)
    })

    test('shx', async () => {
      const shx = USA_adm1.parse('shx')
      expect(shx.header.file.code).toBe(9994)
      expect(shx.header.file.length).toBe(258)
      expect(shx.header.type).toBe(5)
      expect(shx.header.boundingBox.minX).toBe(-179.15055847167963)
      expect(shx.header.boundingBox.minY).toBe(18.909858703613395)
      expect(shx.header.boundingBox.maxX).toBe(179.77340698242205)
      expect(shx.header.boundingBox.maxY).toBe(72.68750000000004)
      expect(shx.header.range.minZ).toBe(0)
      expect(shx.header.range.maxZ).toBe(0)
      expect(shx.header.range.minM).toBe(0)
      expect(shx.header.range.maxM).toBe(0)
      expect(shx.records.length).toBe(52)
      expect(shx.records[0].offset).toBe(50)
      expect(shx.records[0].length).toBe(88300)
    })

    test('dbf', () => {
      const dbf = USA_adm1.parse('dbf', { timezone: 'UTC', properties: true })
      expect(dbf.header.version).toBe(DbaseVersion.Level5) // 3
      expect(dbf.header.lastUpdated.toISOString()).toBe(moment.utc('2015-08-11 00:00:00').toISOString())
      expect(dbf.header.numberOfRecords).toBe(52)
      expect(dbf.header.numberOfBytesInHeader).toBe(321)
      expect(dbf.header.numberOfBytesInRecord).toBe(474)
      expect(dbf.header.languageDriver).toBeUndefined()
      expect(dbf.fields.length).toBe(9)
      dbf.fields.forEach(field => {
        expect(field.properties).toBeDefined()
        expect(field.properties!.length).toBe(dbf.header.numberOfRecords)
      })
    })

    test('prj', () => {
      const prj = Buffer.from(USA_adm1.contents.prj!).toString('utf-8')
      expect(prj).toBe('GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]')
    })
  })
})

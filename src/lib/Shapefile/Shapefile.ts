import { loadAsync } from 'jszip'
import { extname } from 'path'
import {
  Dbase,
  DbaseVersion,
  Shape,
  ShapeIndex
} from '../../types'
import * as parsers from './parsers'
import { DbfOptions } from './parsers/dbf'
import { ShapefileContents } from './Shapefile.types'

class Shapefile {
  public static load = load

  public readonly contents: ShapefileContents

  constructor(contents: ShapefileContents) {
    this.contents = contents
  }

  public parse(key: 'shp'): Shape;
  public parse(key: 'shx'): ShapeIndex;
  public parse(key: 'dbf', options: DbfOptions): Dbase<DbaseVersion, typeof options.properties>;
  public parse(key: keyof ShapefileContents, ...args: any) {
    switch (key) {
      case 'shp':
        return parsers.shp(this.contents.shp.buffer)
      case 'shx':
        return parsers.shx(this.contents.shx.buffer)
      case 'dbf':
        return parsers.dbf(this.contents.dbf.buffer, args[0])
    }

    return undefined
  }
}

/**
 * Load a .zip file containing one or more shapefiles
 *
 * The following file structure would result in a record containing two
 * shapefile objects, each named respectively "agm0" and "agm1"
 * ```txt
 * agm.zip
 * ├── agm0
 * │   ├── agm0.shp
 * │   ├── agm0.shx
 * │   └── agm0.dbf
 * └── agm1
 *     ├── agm1.shp
 *     ├── agm1.shx
 *     └── agm1.dbf
 * ```
 */
export async function load(zip: Parameters<typeof loadAsync>[0]): Promise<Record<string, Shapefile>>;
/**
 * @deprecated The "multiple" parameter will be removed completely in version 1.0.0
 */
export async function load(zip: Parameters<typeof loadAsync>[0], multiple?: boolean): Promise<Record<string, Shapefile>>;
export async function load(zip: Parameters<typeof loadAsync>[0]): Promise<Record<string, Shapefile>> {
  const jszip = await loadAsync(zip)

  const filePaths = Object.keys(jszip.files).filter(path => !jszip.files[path].dir)
  const reducedFilePaths = reducePaths(filePaths)

  const shapefiles: Record<string, Shapefile> = {}
  await Promise.all(Object.keys(reducedFilePaths).map(async key => {
    const objects = reducedFilePaths[key].map(filePath => jszip.files[filePath])

    const contents: Partial<ShapefileContents> = {}
    await Promise.all(objects.map(async object => {
      const extension = extname(object.name)

      const data = await object.async('uint8array')
      switch (extension) {
        case '.shp':
          contents.shp = data
          break
        case '.shx':
          contents.shx = data
          break
        case '.dbf':
          contents.dbf = data
          break
        case '.prj':
          contents.prj = data
          break
        case '.sbn':
        case '.sbx':
          contents.sbn = data
          break
        case '.fbn':
        case '.fbx':
          contents.fbn = data
          break
        case '.ain':
        case '.aih':
          contents.ain = data
          break
        case '.ixs':
          contents.ixs = data
          break
        case '.mxs':
          contents.mxs = data
          break
        case '.atx':
          contents.atx = data
          break
        case '.xml':
          if (object.name.includes('.shp.xml')) contents.shpxml = data
          break
        case '.cpg':
          contents.cpg = data
          break
        case '.qix':
          contents.qix = data
          break
      }
    }))

    if (contents.shp == null) throw new Error('Archive does not contain a .shp file.')
    if (contents.shx == null) throw new Error('Archive does not contain a .shx file.')
    if (contents.dbf == null) throw new Error('Archive does not contain a .dbf file.')

    shapefiles[key] = new Shapefile(contents as ShapefileContents)
  }))

  const shapefileKeys = Object.keys(shapefiles)
  if (shapefileKeys.length === 0) throw new Error('No shapefiles found.')
  return shapefiles
}

function reducePaths(paths: string[]): Record<string, string[]> {
  return paths.reduce<Record<string, string[]>>((accumulator, path) => {
    let filenameWithoutExtension: string
    let extension: string
    if (path.includes('/')) {
      const pathSplit = path.split('/')
      const filename = pathSplit[pathSplit.length - 1]
      extension = extname(filename)
      filenameWithoutExtension = filename.replace(extension, '')
    } else {
      const filename = path
      extension = extname(filename)
      filenameWithoutExtension = filename.replace(extension, '')
    }

    if (isRelevantExtension(extension)) {
      if (accumulator[filenameWithoutExtension]) accumulator[filenameWithoutExtension].push(path)
      else accumulator[filenameWithoutExtension] = [path]
    }

    return accumulator
  }, {})
}

function isRelevantExtension(extension: string): boolean {
  return [
    '.shp',
    '.shx',
    '.dbf',
    '.prj',
    '.sbn', '.sbx',
    '.fbn', '.fbx',
    '.ain', '.aix',
    '.ixs',
    '.mxs',
    '.atx',
    '.shp.xml',
    '.cpg',
    '.qix'
  ].includes(extension)
}

export default Shapefile

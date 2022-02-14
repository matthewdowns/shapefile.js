import { loadAsync } from 'jszip';
import { extname } from 'path';
import Shapefile from './Shapefile';
import { ShapefileContents } from './Shapefile.types';

/**
 * Load a .zip file containing one or more shapefiles
 * 
 * If multiple shapefile collections are present in the .zip file, this function should
 * be called with the "multiple" parameter set to `true`. For example:
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
 * 
 * Note that placing the shapefile collections in separate folders _is_ allowed.
 */
export async function load(zip: Parameters<typeof loadAsync>[0]): Promise<Shapefile>;
export async function load(zip: Parameters<typeof loadAsync>[0], multiple: false): Promise<Shapefile>;
export async function load(zip: Parameters<typeof loadAsync>[0], multiple: true): Promise<Record<string, Shapefile>>;
export async function load(zip: Parameters<typeof loadAsync>[0], multiple?: boolean): Promise<Shapefile | Record<string, Shapefile>> {
    const jszip = await loadAsync(zip);

    const filePaths = Object.keys(jszip.files).filter(path => !jszip.files[path].dir);
    const reducedFilePaths = reducePaths(filePaths);

    const shapefiles: Record<string, Shapefile> = {};
    await Promise.all(Object.keys(reducedFilePaths).map(async key => {
        const objects = reducedFilePaths[key].map(filePath => jszip.files[filePath]);

        let contents: Partial<ShapefileContents> = {};
        await Promise.all(objects.map(async object => {
            const extension = extname(object.name);

            const data = await object.async('uint8array');
            switch (extension) {
                case '.shp':
                    contents.shp = data;
                    break;
                case '.shx':
                    contents.shx = data;
                    break;
                case '.dbf':
                    contents.dbf = data;
                    break;
                case '.prj':
                    contents.prj = data;
                    break;
                case '.sbn':
                case '.sbx':
                    contents.sbn = data;
                    break;
                case '.fbn':
                case '.fbx':
                    contents.fbn = data;
                    break;
                case '.ain':
                case '.aih':
                    contents.ain = data;
                    break;
                case '.ixs':
                    contents.ixs = data;
                    break;
                case '.mxs':
                    contents.mxs = data;
                    break;
                case '.atx':
                    contents.atx = data;
                    break;
                case '.xml':
                    if (object.name.includes('.shp.xml')) contents.shpxml = data;
                    break;
                case '.cpg':
                    contents.cpg = data;
                    break;
                case '.qix':
                    contents.qix = data;
                    break;
            }
        }));

        if (!contents.shp) throw new Error('Archive does not contain a .shp file.');
        if (!contents.shx) throw new Error('Archive does not contain a .shx file.');
        if (!contents.dbf) throw new Error('Archive does not contain a .dbf file.');

        shapefiles[key] = new Shapefile(contents as ShapefileContents);
    }));

    const shapefileKeys = Object.keys(shapefiles);
    if (shapefileKeys.length === 0) throw new Error('No shapefiles found.');
    if (multiple === true) {
        if (shapefileKeys.length === 1) console.warn(`Function "load" was called expecting multiple shapefiles, but only one was found.`);
        return shapefiles;
    } else {
        if (shapefileKeys.length > 1) console.warn(`Function "load" was called expecting only one shapefile, but multiple were found.`);
        return shapefiles[shapefileKeys[0]];
    }
}

function reducePaths(paths: string[]): Record<string, string[]> {
    return paths.reduce<Record<string, string[]>>((accumulator, path) => {
        let filenameWithoutExtension: string;
        let extension: string;
        if (path.includes('/')) {
            const pathSplit = path.split('/');
            const filename = pathSplit[pathSplit.length - 1];
            extension = extname(filename);
            filenameWithoutExtension = filename.replace(extension, '');
        } else {
            const filename = path;
            extension = extname(filename);
            filenameWithoutExtension = filename.replace(extension, '');
        }

        if (isRelevantExtension(extension)) {
            if (accumulator[filenameWithoutExtension]) accumulator[filenameWithoutExtension].push(path);
            else accumulator[filenameWithoutExtension] = [path];
        }

        return accumulator;
    }, {});
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
    ].includes(extension);
}

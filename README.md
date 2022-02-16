# shapefile.js

[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/shapefile.js)](https://img.shields.io/librariesio/release/npm/shapefile.js)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-semistandard-brightgreen.svg)](https://standardjs.com)
[![CodeQL](https://github.com/matthewdowns/shapefile.js/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/matthewdowns/shapefile.js/actions/workflows/codeql-analysis.yml)
[![Node.js CI](https://github.com/matthewdowns/shapefile.js/actions/workflows/node.js.yml/badge.svg)](https://github.com/matthewdowns/shapefile.js/actions/workflows/node.js.yml)




## Introduction

Easily read and parse ShapeFiles from the browser. Shapefile.js allows you to load a .zip as a buffer,
and parse each file individually.

> ### [What is a Shapefile?](https://en.wikipedia.org/wiki/Shapefile)
>
> The shapefile format is a geospatial vector data format for geographic information system (GIS) software.
> It is developed and regulated by Esri as a mostly open specification for data interoperability among Esri
> and other GIS software products. The shapefile format can spatially describe vector features: points,
> lines, and polygons, representing, for example, water wells, rivers, and lakes. Each item usually has
> attributes that describe it, such as name or temperature.




## Usage

Install the package into your app
```bash
npm install --save shapefile.js
```

Import the `Shapefile` class and load a shapefile (using React as an example)
```tsx
import React, { useState } from 'react';
import { Shapefile } from 'shapefile.js';

function App() {
    const [shapefile, setShapefile] = useState<Shapefile>();
    
    return (
        <div>
            <input type="file" onChange={e => {
                if (e.target.files.length > 0) {
                    e.target.files[0].arrayBuffer().then(fileArrayBuffer => {
                        Shapefile.load(fileArrayBuffer).then(_shapefile => {
                            setShapefile(_shapefile);
                        });
                    });
                }
            }}>
        </div>
    );
}
```

You can parse each file in the ShapeFile ZIP. Some files require additional arguments.
```tsx
const parsedShp = await shapefile.parse('shp');
const parsedShx = await shapefile.parse('shx');
const parsedDbf = await shapefile.parse('dbf', {
    // the expected timezone that dates are stored as in the .dbf file
    timezone: 'UTC',
    // stop parsing the file when the byte position hits the field descriptors
    // terminator this allows you to quickly get the fields used in the .dbf
    // file and ignore the remainder of the file
    properties: false
});
```




## License

Distributed under the GPL-3.0 License. See [LICENSE](https://github.com/matthewdowns/shapefile.js/tree/main/LICENSE) for more information.




## Contact

Matthew Downs

Email: [matthew.downsc@gmail.com](mailto:matthew.downsc@gmail.com)

Project Link: [https://github.com/matthewdowns/shapefile.js](https://github.com/matthewdowns/shapefile.js)

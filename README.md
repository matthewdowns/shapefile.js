# shapefile.js

[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/shapefile.js)](https://img.shields.io/librariesio/release/npm/shapefile.js)
[![CodeQL](https://github.com/matthewdowns/shapefile.js/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/matthewdowns/shapefile.js/actions/workflows/codeql-analysis.yml)
[![Node.js CI](https://github.com/matthewdowns/shapefile.js/actions/workflows/node.js.yml/badge.svg)](https://github.com/matthewdowns/shapefile.js/actions/workflows/node.js.yml)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)



## Introduction

Easily read and parse Shapefiles from the browser. Shapefile.js allows you to load a .zip as a buffer,
and parse each file individually.

> ### [What is a Shapefile?](https://en.wikipedia.org/wiki/Shapefile)
>
> The shapefile format is a geospatial vector data format for geographic information system (GIS) software.
> It is developed and regulated by Esri as a mostly open specification for data interoperability among Esri
> and other GIS software products. The shapefile format can spatially describe vector features: points,
> lines, and polygons, representing, for example, water wells, rivers, and lakes. Each item usually has
> attributes that describe it, such as name or temperature.




## Usage

Install the package into your application
```bash
npm install --save shapefile.js
```

Import the `Shapefile` class and load a shapefile (using React as an example)
```tsx
import React, { useState } from 'react';
import Shapefile from 'shapefile.js';

function App() {
  const [shapefile, setShapefile] = useState<Shapefile>();

  return (
    <div>
      <input type="file" onChange={async e => {
        if (e.target.files.length > 0) {
          // Get the array buffer of the uploaded file
          e.target.files[0].arrayBuffer().then(arrayBuffer => {
            // Load the .zip shapefile to expose its contents
            Shapefile.load(arrayBuffer).then(_shapefile => {
              // Set shapefile state
              setShapefile(_shapefile)
            })
          })
        }
      }}>
    </div>
  )
}
```

You can parse each file in the Shapefile ZIP. Some files require additional arguments.
```tsx
const parsedShp = shapefile.parse('shp');
const parsedShx = shapefile.parse('shx');
const parsedDbf = shapefile.parse('dbf', {
  // The expected timezone that dates are stored as in the .dbf file
  timezone: 'UTC',
  
  // Stop parsing the file when the byte position hits the field descriptors terminator
  // This allows you to quickly get the fields used in the .dbf file and ignore the remainder of the file
  properties: false
});
```




## License

Distributed under the GPL-3.0 License. See [LICENSE](https://github.com/matthewdowns/shapefile.js/tree/main/LICENSE) for more information.




## Contact

Matthew Downs

Email: [matthew.downsc@gmail.com](mailto:matthew.downsc@gmail.com)

Project Link: [https://github.com/matthewdowns/shapefile.js](https://github.com/matthewdowns/shapefile.js)

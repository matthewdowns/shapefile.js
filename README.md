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

### React

Install the package into your application
```bash
npm install --save shapefile.js
```

Import the `Shapefile` class from `shapefile.js`
```jsx
import React, { useState } from 'react'
import { Shapefile } from 'shapefile.js'

function ShapefileImporter() {
  const [shapefile, setShapefile] = useState()

  return (
    <input
      type="file"
      onChange={e => {
        if (e.target.files.length > 0) {
          e.target.files[0].arrayBuffer().then(arrayBuffer => {
            // Load the .zip file to expose its contents
            Shapefile.load(arrayBuffer).then(_shapefile => {
              // Set shapefile state
              setShapefile(_shapefile)
            })
          })
        }
      }}
    />
  )
}

export default ShapefileImporter
```

You can parse each file in the Shapefile ZIP. Some files require additional arguments.
```js
const shp = shapefile.parse('shp');
const shx = shapefile.parse('shx');
const dbf = shapefile.parse('dbf', {
  // Stop parsing the file when the byte position hits the field descriptors terminator
  // This allows you to quickly get the fields used in the .dbf file and ignore the remainder of the file
  properties: false
})
```

### UMD

Add a script tag to your HTML file with your desired shapefile.js version from a CDN provider
- UNPKG: https://unpkg.com/shapefile.js/dist/shapefile.js
- jsDelivr: https://cdn.jsdelivr.net/npm/shapefile.js/dist/shapefile.js

_You can use the minified version by simply replacing the ending **.js** extension with **.min.js**_

Use the `ShapefileJS` UMD global variable and access the `Shapefile` class
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">

    <!-- Load shapefile.js library -->
    <script src="https://unpkg.com/shapefile.js/dist/shapefile.js"></script>

    <!-- Add custom JS logic -->
    <script>
      window.addEventListener('DOMContentLoaded', () => {
        const shapefileInput = document.getElementById('shapefile-input')
        shapefileInput.addEventListener('change', () => {
          if (shapefileInput.files.length > 0) {
            shapefileInput.files[0].arrayBuffer().then(arrayBuffer => {
              // Load the .zip file to expose its contents
              ShapefileJS.Shapefile.load(arrayBuffer).then(shapefile => {
                console.log(shapefile.contents)
              })
            })
          }
        })
      })
    </script>
  </head>
  <body>
    <div>
      <input id="shapefile-input" type="file" />
    </div>
  </body>
```




## License

Distributed under the GPL-3.0 License. See [LICENSE](https://github.com/matthewdowns/shapefile.js/tree/main/LICENSE) for more information.




## Contact

Matthew Downs

Email: [matthew.downsc@gmail.com](mailto:matthew.downsc@gmail.com)

Project Link: [https://github.com/matthewdowns/shapefile.js](https://github.com/matthewdowns/shapefile.js)

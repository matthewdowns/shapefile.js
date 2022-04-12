export interface ShapefileContents {
  // Mandatory files

  /**
   * @name
   * .shp
   *
   * @description
   * Shape format; the feature geometry itself
   *
   * @contentType
   * x-gis/x-shapefile
   */
  shp: Uint8Array

  /**
   * @name
   * .shx
   *
   * @description
   * Shape index format; a positional index of the feature geometry to allow seeking forwards and backwards quickly
   *
   * @contentType
   * x-gis/x-shapefile
   */
  shx: Uint8Array

  /**
   * @name
   * .dbf
   *
   * @description
   * Attribute format; columnar attributes for each shape, in dBase IV format
   *
   * @contentType
   * application/octet-stream, text/plain
   */
  dbf: Uint8Array

  // Optional files

  /**
   * @name
   * .prj
   *
   * @description
   * Projection description, using a well-known text representation of coordinate reference systems
   *
   * @contentType
   * text/plain, application/text
   */
  prj?: Uint8Array

  /**
   * @name
   * .sbn, .sbx
   *
   * @description
   * A spatial index of the features
   *
   * @contentType
   * x-gis/x-shapefile
   */
  sbn?: Uint8Array

  /**
   * @name
   * .fbn, .fbx
   *
   * @description
   * A spatial index of the features that are read-only
   *
   * @contentType
   * x-gis/x-shapefile
   */
  fbn?: Uint8Array

  /**
   * @name
   * .ain, .aix
   *
   * @description
   * An attribute index of the active fields in a table
   *
   * @contentType
   * x-gis/x-shapefile
   */
  ain?: Uint8Array

  /**
   * @name
   * .ixs
   *
   * @description
   * A geocoding index for read-write datasets
   *
   * @contentType
   * x-gis/x-shapefile
   */
  ixs?: Uint8Array

  /**
   * @name
   * .mxs
   *
   * @description
   * A geocoding index for read-write datasets (ODB format)
   *
   * @contentType
   * x-gis/x-shapefile
   */
  mxs?: Uint8Array

  /**
   * @name
   * .atx
   *
   * @description
   * An attribute index for the .dbf file in the form of shapefile.columnname.atx (ArcGIS 8 and later)
   *
   * @contentType
   * x-gis/x-shapefile
   */
  atx?: Uint8Array

  /**
   * @name
   * .shp.xml
   *
   * @description
   * Geospatial metadata in XML format, such as ISO 19115 or other XML schema
   *
   * @contentType
   * application/fgdc+xml
   */
  shpxml?: Uint8Array

  /**
   * @name
   * .cpg
   *
   * @description
   * Used to specify the code page (only for .dbf) for identifying the character encoding to be used
   *
   * @contentType
   * text/plain, x-gis/x-shapefile
   */
  cpg?: Uint8Array

  /**
   * @name
   * .qix
   *
   * @description
   * An alternative quadtree spatial index used by MapServer and GDAL/OGR software
   *
   * @contentType
   * x-gis/x-shapefile
   */
  qix?: Uint8Array
}

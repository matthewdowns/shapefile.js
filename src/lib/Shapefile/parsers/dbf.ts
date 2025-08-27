import {
  Dbase,
  DbaseHeader,
  DbaseField,
  DbaseVersion
} from '../../../types'

export interface DbfOptions {
  properties: boolean
}

function dbf(arrayBuffer: ArrayBufferLike, options: DbfOptions): Dbase<DbaseVersion, typeof options.properties> {
  const array = new Uint8Array(arrayBuffer)
  const dv = new DataView(arrayBuffer)

  const version = array[0] as DbaseVersion
  const year = 1900 + array[1]
  const month = array[2]
  const date = array[3]
  const lastUpdatedISO = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T00:00:00.000Z`
  const lastUpdated = new Date(lastUpdatedISO)
  const numberOfRecords = dv.getUint32(4, true)
  const numberOfBytesInHeader = dv.getUint16(8, true)
  const numberOfBytesInRecord = dv.getUint16(10, true)
  const languageDriver = version === DbaseVersion.Level7
    ? {
      id: array[29],
      name: Buffer.from(array.slice(32, 64)).toString('utf-8').trim()
    }
    : undefined

  const header: DbaseHeader<DbaseVersion> = {
    version,
    lastUpdated,
    numberOfRecords,
    numberOfBytesInHeader,
    numberOfBytesInRecord,
    languageDriver
  }
  const fields = getFields(
    new Uint8Array(arrayBuffer.slice(version === DbaseVersion.Level5
      ? 32
      : 68,
      arrayBuffer.byteLength)),
    header,
    options)

  return {
    header,
    fields
  }
}

function getFields(array: Uint8Array, header: DbaseHeader<DbaseVersion>, options: DbfOptions): Array<DbaseField<typeof header.version, typeof options.properties>> {
  let size: number
  switch (header.version) {
    case DbaseVersion.Level5:
      size = 32
      break
    case DbaseVersion.Level7:
      size = 48
      break
  }

  const fields: Array<DbaseField<typeof header.version, typeof options.properties>> = []
  let bp = 0
  let terminated = false
  do {
    const terminator = array[bp]
    if (terminator === 0x0D) terminated = true
    else {
      fields.push(getField(array.slice(bp, bp + size), header.version, options.properties))
      bp += size
    }
  } while (!terminated)
  bp += 1

  if (options.properties === true) {
    do {
      for (let i = 0; i < fields.length; i++) {
        const valueRaw = Buffer.from(array.slice(bp, bp + fields[i].length)).toString('utf-8').trim()
        let value: any
        switch (fields[i].type) {
          case 'C':
            value = valueRaw
            break
          case 'F':
            value = parseFloat(valueRaw)
            break
          case 'L': {
            value =
              (['Y', 'y', 'T', 't'].includes(valueRaw))
                ? true
                : (['N', 'n', 'F', 'f'].includes(valueRaw))
                  ? false
                  : null
            break
          }
          case 'M':
            value = valueRaw
            break
          case 'N':
            value = parseFloat(valueRaw)
        }
        bp += fields[i].length
        if (fields[i].properties!.length < header.numberOfRecords) fields[i].properties!.push(value)
      }
    } while (bp < array.byteLength)
  }

  return fields
}

function getField(arrayBuffer: Uint8Array, version: DbaseVersion, properties: boolean): DbaseField<typeof version, typeof properties> {
  const array = new Uint8Array(arrayBuffer)

  switch (version) {
    case DbaseVersion.Level5: {
      const name = Buffer.from(array.slice(0, 11)).toString('utf-8').replace(/[\u0000]+$/, '').trim()
      const type = Buffer.from(array.slice(11, 12)).toString('utf-8').trim()
      const length = array[16]
      const decimals = array[17]
      const field: DbaseField<DbaseVersion.Level5, typeof properties> = {
        name,
        type,
        length,
        decimals,
        properties: properties ? [] : undefined
      }
      return field
    }
    case DbaseVersion.Level7: {
      const name = Buffer.from(array.slice(0, 32).filter(n => n)).toString('utf-8').trim()
      const type = Buffer.from(array.slice(32, 33).filter(n => n)).toString('utf-8').trim()
      const length = array[33]
      const decimals = array[34]
      const autoincrement = Buffer.from(array.slice(40, 44)).readIntLE(0, 4) || undefined
      const field: DbaseField<DbaseVersion.Level7, typeof properties> = {
        name,
        type,
        length,
        decimals,
        autoincrement,
        properties: properties ? [] : undefined
      }
      return field
    }
  }
}

export default dbf

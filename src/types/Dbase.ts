import { DbaseVersion } from './enums'
import DbaseField from './DbaseField'
import DbaseHeader from './DbaseHeader'

interface Dbase<TVersion extends DbaseVersion, TProperties extends boolean> {
  header: DbaseHeader<TVersion>
  fields: Array<DbaseField<TVersion, TProperties>>
}

export default Dbase

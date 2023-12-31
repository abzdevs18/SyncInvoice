// ** MUI Imports
import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

// ** Data
import { top100Films } from 'src/@fake-db/autocomplete'

interface FilmOptionType {
  year: number
  title: string
}

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: FilmOptionType) => option.title
})

const AutocompleteCustomFilter = () => {
  return (
    <Autocomplete
      options={top100Films}
      filterOptions={filterOptions}
      id='autocomplete-custom-filter'
      getOptionLabel={options => (typeof options === 'string' ? options : options.title).toString()}
      renderInput={params => <TextField {...params} label='Custom filter' />}
    />
  )
}

export default AutocompleteCustomFilter

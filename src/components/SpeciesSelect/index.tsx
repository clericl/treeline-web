import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material"
import { HTMLAttributes, ReactNode, useCallback, useMemo, useState } from "react"
import { speciesDetails } from "@/data"
import { SpeciesOption, useSelectedSpecies } from "@/zustand/useSelectedSpecies"

const nameData = Object.entries(speciesDetails).map(([scientific, detail]) => ({
  id: scientific,
  title: detail.commonNames,
  color: detail.color,
}))

const autocompleteOptions = createFilterOptions({
  stringify: (option: SpeciesOption) => [option.id, option.title].join(' ')
})

export default function SpeciesSelect() {
  const [inputValue, setInputValue] = useState('')
  
  const addSelectedSpecies = useSelectedSpecies.use.add()
  const removeSelectedSpecies = useSelectedSpecies.use.remove()
  const selectedSpecies = useSelectedSpecies.use.species()

  const handleChange = useCallback((_: unknown, newValue: SpeciesOption | null) => {
    if (newValue) {
      addSelectedSpecies(newValue)
      setInputValue('')
    }
  }, [addSelectedSpecies])

  const handleDelete = useCallback((speciesName: string) => {
    removeSelectedSpecies(speciesName)
  }, [removeSelectedSpecies])

  const renderOption = useCallback((
    props: HTMLAttributes<HTMLLIElement> & { key?: string },
    option: SpeciesOption,
  ) => {
    const {
      key,
      ...spreadableProps
    } = props

    return (
      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} key={key} {...spreadableProps}>
        <Stack>
          <Typography variant="body1">{option.id}</Typography>
          <Typography variant="body2">{option.title}</Typography>
        </Stack>
      </Box>
    )
  }, [])

  const renderedTags = useMemo(() => {
    const tagArr: ReactNode[] = []

    selectedSpecies.forEach(({ id, color }) => tagArr.push(
      <Chip
        key={id}
        label={id}
        onDelete={() => handleDelete(id)}
        variant="outlined"
        sx={{
          backgroundColor: `rgba(${color[0]} ${color[1]} ${color[2]} / ${color[3]})`,
          border: 'none',
          fontFamily: 'var(--font-mui)',
        }}
      />
    ))

    return tagArr
  }, [handleDelete, selectedSpecies])

  return (
    <Box sx={{ paddingLeft: 0, paddingRight: 0 }}>
      <Autocomplete
        disablePortal
        inputValue={inputValue}
        filterOptions={autocompleteOptions}
        getOptionLabel={(option) => option.id || ''}
        onChange={handleChange}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue)
        }}
        options={nameData}
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by species"
            size="small"
          />
        )}
        value={null}
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ marginTop: 1 }}
        useFlexGap
        flexWrap="wrap"
      >
        {renderedTags}
      </Stack>
    </Box>
  )
}

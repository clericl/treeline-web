import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { speciesDetails } from "@/data";
import { SpeciesOption, useSelectedSpecies } from "@/zustand";

const nameData = Object.entries(speciesDetails)
  .slice(1)
  .map(([scientific, detail]) => ({
    id: scientific,
    title: detail.commonNames,
    color: detail.color,
  }));

const autocompleteOptions = createFilterOptions({
  stringify: (option: SpeciesOption) => [option.id, option.title].join(" "),
});

export default function SpeciesSelect() {
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const addSelectedSpecies = useSelectedSpecies.use.add();
  const removeSelectedSpecies = useSelectedSpecies.use.remove();
  const selectedSpecies = useSelectedSpecies.use.species();

  const handleChange = useCallback(
    (_: unknown, newValue: SpeciesOption | null) => {
      if (newValue) {
        addSelectedSpecies(newValue);
        setInputValue("");
      }
    },
    [addSelectedSpecies],
  );

  const handleDelete = useCallback(
    (speciesName: string) => {
      removeSelectedSpecies(speciesName);
    },
    [removeSelectedSpecies],
  );

  const renderOption = useCallback(
    (
      props: HTMLAttributes<HTMLLIElement> & { key?: string },
      option: SpeciesOption,
    ) => {
      const { key, ...spreadableProps } = props;

      return (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          key={key}
          {...spreadableProps}
        >
          <Stack>
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", lineHeight: 1.2 }}
            >
              {option.id}
            </Typography>
            <Typography
              variant="body2"
              sx={{ lineHeight: 1.2, marginTop: "3px" }}
            >
              {option.title}
            </Typography>
          </Stack>
        </Box>
      );
    },
    [],
  );

  const renderedTags = useMemo(() => {
    const tagArr: ReactNode[] = [];

    selectedSpecies.forEach(({ id, color }) =>
      tagArr.push(
        <Chip
          key={id}
          label={id}
          onDelete={() => handleDelete(id)}
          variant="outlined"
          sx={{
            backgroundColor: `rgba(${color[0]} ${color[1]} ${color[2]} / ${color[3]})`,
            border: "none",
            fontFamily: "var(--font-mui)",
          }}
        />,
      ),
    );

    return tagArr;
  }, [handleDelete, selectedSpecies]);

  return (
    <Box sx={{ pl: 0, pr: 0, pt: isMobile ? 1 : 3, pb: 3 }}>
      <Autocomplete
        disablePortal
        inputValue={inputValue}
        filterOptions={autocompleteOptions}
        getOptionLabel={(option) => option.id || ""}
        onChange={handleChange}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={nameData}
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField {...params} label="Filter by species" size="small" />
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
  );
}

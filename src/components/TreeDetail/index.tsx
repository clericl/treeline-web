import { Box, CircularProgress, Link, Typography, useMediaQuery, useTheme } from "@mui/material"
import { SpeciesDetailsType } from "@/types"
import { speciesDetails } from "@/data"
import { useMemo } from "react"
import { useTreeQuery, useWikiQuery } from "@/hooks"

const typedSpeciesDetails: SpeciesDetailsType = speciesDetails

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export default function TreeDetail() {
  const { data, isLoading } = useTreeQuery()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    closestAddress,
    diameter,
    health,
    latinName,
    latitude,
    longitude,
    stumpDiameter,
  } = useMemo(() => (data ? {
    closestAddress: toTitleCase(data['address']),
    diameter: data['tree_dbh'],
    health: data['health'],
    latinName: data['spc_latin'],
    latitude: data['latitude'],
    longitude: data['longitude'],
    problems: data['problems'],
    status: data['status'],
    stumpDiameter: data['stump_diam'],
  } : {}), [data])

  const wikiTitle = useMemo(() => {
    if (latinName) {
      const speciesDetail = typedSpeciesDetails[latinName]
      return speciesDetail.wikiTitle || latinName
    }

    return ''
  }, [latinName])

  const { data: wikiData, isLoading: wikiLoading } = useWikiQuery(wikiTitle)

  return (
    <Box sx={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '129px' }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : (
        <Box sx={{ pb: 3, pt: isMobile ? 1 : 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-mui)',
              fontStyle: latinName ? 'italic' : 'normal',
              lineHeight: 1.1,
            }}
          >{data ? (latinName || 'Stump') : 'Unknown'}</Typography>
          {latinName && (
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'var(--font-mui)',
                lineHeight: 1.1,
                marginTop: 1,
              }}
            >{typedSpeciesDetails[latinName].commonNames}</Typography>
          )}
          <Typography
            component="div"
            variant="body2"
            sx={{
              fontFamily: 'var(--font-mui)',
              lineHeight: 1.25,
              marginTop: 2,
            }}
          >
            {closestAddress && (<p>Closest address: {closestAddress}</p>)}
            <p>Diameter: {diameter ? diameter : stumpDiameter} in.</p>
            {health && <p>Condition: {health}</p>}
            <p>Longitude: {longitude}</p>
            <p>Latitude: {latitude}</p>
          </Typography>
          {(wikiLoading || !wikiData) ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
              <CircularProgress size="small" sx={{ color: 'white' }} />
            </Box>
          ) : (
            <Box>
              <Typography
                component="div"
                variant="body2"
                sx={{
                  fontFamily: 'var(--font-mui)',
                  lineHeight: 1.25,
                  marginTop: 2,
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: wikiData.extract_html }}></div>
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                <Link
                  href={wikiData.content_urls.desktop.page}
                  rel="noopener"
                  target="_blank"
                >
                  Read more (Wikipedia) ❯
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

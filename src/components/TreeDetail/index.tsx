import { Box, CircularProgress, Link, Typography } from "@mui/material"
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

  const {
    closestAddress,
    diameter,
    health,
    latinName,
    latitude,
    longitude,
    problems,
    status,
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

  const { data: wikiData, isLoading: wikiLoading } = useWikiQuery(latinName)

  return (
    <Box sx={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '129px' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-mui)',
              fontStyle: latinName ? 'italic' : 'normal',
            }}
          >{data ? (latinName || 'Stump') : 'Unknown'}</Typography>
          {latinName && (
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'var(--font-mui)',
                lineHeight: 1.1,
              }}
            >{typedSpeciesDetails[latinName].commonNames}</Typography>
          )}
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'var(--font-mui)',
              lineHeight: 1.25,
              marginTop: 2,
            }}
          >
            <p>Diameter: {diameter ? diameter : stumpDiameter} in.</p>
            {closestAddress && (<p>Closest address: {closestAddress}</p>)}
            <p>Longitude: {longitude}</p>
            <p>Latitude: {latitude}</p>
          </Typography>
          {(wikiLoading || !latinName) ? (
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

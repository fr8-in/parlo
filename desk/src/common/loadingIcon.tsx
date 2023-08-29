import { Box, CircularProgress, Fab } from "@mui/material";


interface Props {
  icon: any
  loading?: boolean
  handleButtonClick?: any
  disabled?: any
  color?: any
  size?: any
}


const LoadingIcon = (props:Props) => {

  const { icon, loading, handleButtonClick, disabled, color, size } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ ml: 1, position: 'relative'}}>
        <Fab
          size={size || 'small'}
          aria-label="save"
          color={color || 'secondary'}
          disabled={loading || disabled}
          onClick={handleButtonClick}
        >
          {icon}
        </Fab>
        {loading && (
          <CircularProgress
            size={48}
            sx={{
              color: 'lightblue',
              position: 'absolute',
              top: -4,
              left: -4,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Box>
  )
}


export default LoadingIcon;
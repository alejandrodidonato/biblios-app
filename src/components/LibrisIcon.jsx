import { SvgIcon } from '@mui/material'

const LibrisIcon = ({ fontSize = 16, color = '#ffffff', bgColor = '#388E3C', borderColor = '#D8B819', size = 30 }) => {
  return (
    <SvgIcon
      viewBox="0 0 100 100"
      sx={{
        width: size,
        height: size,
      }}
    >
      <polygon
        points="50,0 100,50 50,100 0,50"
        fill={bgColor}
        stroke={borderColor}
        strokeWidth="6"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
        fontFamily="'Avenir Bold', sans-serif"
        fill={color}
        transform="rotate(0, 50, 50)"
      >
        L
      </text>
    </SvgIcon>
  )
}

export default LibrisIcon

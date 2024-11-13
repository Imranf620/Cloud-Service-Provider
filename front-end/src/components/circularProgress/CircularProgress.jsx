

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';



const CircularProgressWithLabel = (props) => {
  return (
    <Gauge
    cx={100}
    cornerRadius={40}
    value={75}
    
    startAngle={-160}
    endAngle={160}
    height={200}
    sx={{
      [`& .${gaugeClasses.valueText}`]: {
        fontSize: 20,
        transform: 'translate(0px, 0px)',
      },

      [`& .${gaugeClasses.valueArc}`]: {
        fill: '#ffff',
      },
    }}
  
    text={
       ({ value, valueMax }) => `${value}% 
        space used `
    }

  />
  );
};

export default CircularProgressWithLabel;

import React from 'react'
import Box from "@mui/material/Box";

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      {...other}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 1, pb: 1 }}>{children}</Box>}
    </div>
  );
}

export default TabPanel

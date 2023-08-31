import { blue } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { ReactNode } from "react";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: any;
  variant?: "standard" | "scrollable" | "fullWidth";
  scrollButtons?: boolean | "auto";
  centered?: boolean;
  onChange: (event: React.SyntheticEvent, newValue: any) => void;
  darkindicator?: string
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      children: (
        <span className={`MuiTabs-indicatorSpan ${props.darkindicator ? "indicator-color" : ""}`} />
      ),
    }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTab-root": {
    minWidth: 42
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 42,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  "& .indicator-color": {
    backgroundColor: blue[600],
    maxWidth: "90%"
  },
});

interface StyledTabProps {
  label: string | ReactNode;
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(() => ({
  textTransform: "none",
color:"rgba(0,0,0,.85)",

  "&.Mui-selected": {
    color:blue[600]
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
import React from "react";
import { styled } from "@mui/material/styles";
import Tab, { tabClasses } from "@mui/material/Tab";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import appTheme from "../theme";

const TabItem = styled(Tab)(({ theme }) => ({
  textTransform: "initial",
  margin: theme.spacing(0, 2),
  minWidth: 0,
  fontWeight: "normal",
  letterSpacing: 0.5,
  color: "#fff",
  borderRadius: "8px",
  [`&.${tabClasses.selected}`]: {
    color: "#fff",
  },
  [theme.breakpoints.up("md")]: {
    minWidth: 0,
  },
}));

export function TabsProfile({ value, onChange }) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        width: "100%",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        background: appTheme.palette.primary.main,
        padding: "10px",
        boxShadow: "0px 3px 15px rgba(34, 35, 58, 0.5)",
        [`& .${tabsClasses.indicator}`]: {
          height: "100%",
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, .2)",
        },
      }}
    >
      <TabItem label={"Mi biblioteca"} />
      <TabItem label={"Mis búsquedas"} />
    </Tabs>
  );
}
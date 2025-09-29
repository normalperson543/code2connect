"use client";

import { Button, createTheme } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "off-blue",
        autoContrast: true,
      },
    }),
  },
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  fontFamilyMonospace: "'Roboto Mono', monospace",
  headings: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  },
  primaryColor: "off-blue",
  primaryShade: { light: 6, dark: 7 },
  defaultRadius: "sm",
  colors: {
    "off-blue": [
      "#e5f3ff",
      "#cde3ff",
      "#9ac3ff",
      "#66a3ff",
      "#3886fe",
      "#1d74fe",
      "#096bff",
      "#005ae4",
      "#0050cd",
      "#0045b5",
    ],
    orangey: [
      "#ffebe4",
      "#ffd7cc",
      "#ffad9a",
      "#ff8064",
      "#ff542e",
      "#ff4218",
      "#ff3507",
      "#e42600",
      "#cc1e00",
      "#b21200",
    ],
  },
});

export default theme;

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: "#1697F6",
    "primary-darken-1": "#7071e8",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#dc3545",
    info: "#AEDDFF",
    success: "#4CAF50",
    lime: "#89C526",
    warning: "#FFC107",
    dark: "#333333",
    light: "#ffffff",
    gray: "#f7f7f7",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
})

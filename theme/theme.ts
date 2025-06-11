// theme/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'green.900',
      },
    },
  },
  colors: {
    brand: {
      green: '#003f2d',
      gold: '#c9a227',
      lightGreen: '#e9f5f1', // ✅ added this
    },
  },
  fonts: {
    heading: `'Segoe UI', sans-serif`,
    body: `'Segoe UI', sans-serif`,
  },
});

export default theme;

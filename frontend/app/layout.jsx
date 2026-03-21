import "./globals.css";
import { StyledEngineProvider } from '@mui/material/styles';



export const metadata = {
  title: "whats_close",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StyledEngineProvider injectFirst> 
        <body>{children}</body>
      </StyledEngineProvider>
    </html>
  );
}

// trying to prevent zooms on mobile especially
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,    // Prevents the browser from zooming in on focus
  userScalable: false, // Prevents users from accidentally pinching the UI
};

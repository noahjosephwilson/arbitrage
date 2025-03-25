import './globals.css';

// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>My Next.js App</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

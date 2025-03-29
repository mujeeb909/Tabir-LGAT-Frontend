export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" />
      </head>
      <body className="bg-gray-100 min-h-screen flex items-center justify-center">
        hy
        {children}
      </body>
    </html>
  );
}

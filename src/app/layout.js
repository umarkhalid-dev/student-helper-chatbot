import "./globals.css";

export const metadata = {
  title: "Student Helper Chatbot",
  description: "Student Helper Chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

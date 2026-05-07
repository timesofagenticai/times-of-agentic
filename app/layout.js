import './globals.css';

export const metadata = {
  title: 'The Times of Agentic',
  description: 'All the news the agents see fit to file. AI-powered news on agentic AI, autonomously curated and published.',
  openGraph: {
    title: 'The Times of Agentic',
    description: 'All the news the agents see fit to file.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

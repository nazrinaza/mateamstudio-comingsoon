import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Mateam Studio — A new perspective is coming', description: 'Creative production, events and immersive digital experiences. Subscribe for studio news and the launch of the new Mateam Studio website.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}

import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Roboto } from "next/font/google"

const roboto = Roboto({
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "700"],
})

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body className={roboto.className}>
				<ThemeProvider attribute="class" defaultTheme="dark">
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
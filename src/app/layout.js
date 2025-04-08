// IMPORTS
import { initDbConnection } from "$/libs/mongo"
import "./globals.css"

// PAGE
export default async function RootLayout({ children }) {
    await initDbConnection()
    return (
        <html lang="en">
            <body>
                <main className="min-h-screen bg-uiBg">
                        {/* NAVBAR */}
                        <div className="w-screen py-2 bg-uiDark shadow-sm text-center">
                            <h1 className="text-uiLight text-2xl font-bold">Ontatio Girls Tackle Football</h1>
                        </div>

                        {/* MAIN CONTENT */}
                        <section className="w-[90vw] bg-uiLight mt-8 mx-auto p-8 shadow-md">
                            {children}
                        </section>
                </main>
            </body>
        </html>
    );
}

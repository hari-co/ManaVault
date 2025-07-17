const Footer: React.FC = () => {
    return (
        <footer className="h-70 w-full bg-[#141823] text-gray-300 px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="border-b border-gray-600 pb-4 mb-6 text-center">
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="mt-5">
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <div className="space-y-2 text-sm">
                            <p>Email: support@manavault.xyz</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Legal</h3>
                        <div className="space-y-2 text-sm">
                            <p>ManaVault is not affiliated with Wizards of the Coast.</p>
                            <p>Magic: The Gathering is a trademark of Wizards of the Coast LLC.</p>
                            <p>Card prices and data provided by Scryfall.</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-600 pt-4 text-center mb-5">
                    <p className="text-gray-400 text-sm">
                        © 2025 ManaVault
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
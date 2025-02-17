import { useEffect } from "react";
import { ShieldCheck, CheckCircle, AlertTriangle, Info, ArrowLeft } from "lucide-react";

function TermsofService() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<div className="bg-gray-100 min-h-screen ">
			<div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
				<div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
					<button
						onClick={() => window.history.back()}
						className="text-gray-600 hover:text-gray-800 focus:outline-none">
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center justify-center">
						<ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
						Terms of Service
					</h2>
					<div></div> {/* Empty div to balance the layout */}
				</div>
				<div className="p-4 sm:p-6">
					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
							Acceptance of Terms
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							By accessing and using our service, you agree to be bound by these Terms of Service. If you
							do not agree to all of these terms, do not use our service.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
							Changes to Terms
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							We reserve the right to modify or revise these Terms of Service at any time. Your continued
							use of the service following the posting of any changes constitutes acceptance of those
							changes.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							Description of Service
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							Our service provides [description of your service]. We may change or discontinue any aspect
							of the service at any time, including its content or features.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							User Conduct
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							You agree to use the service only for lawful purposes and in a way that does not infringe
							the rights of or restrict or inhibit anyone else's use and enjoyment of the service.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							Privacy Policy
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							Your use of the service is also subject to our Privacy Policy, which is incorporated into
							these Terms of Service by reference.
						</p>
					</section>

					{/* Add more sections as needed */}
				</div>
				<div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right text-sm">
					<p className="text-gray-500">Last updated: January 26, 2025</p>
				</div>
			</div>
		</div>
	);
}

export default TermsofService;

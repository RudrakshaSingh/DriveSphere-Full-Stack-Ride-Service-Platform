import { useEffect } from "react";
import { KeyRound, CheckCircle, AlertTriangle, Info, ArrowLeft } from "lucide-react";

function PrivacyPolicy() {
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
					<h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center">
						<KeyRound className="mr-2 h-5 w-5 text-purple-500" />
						Privacy Policy
					</h2>
					<div></div> {/* Empty div to balance the layout */}
				</div>
				<div className="p-4 sm:p-6">
					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
							Information Collection
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							We collect information to provide better services to all our users. This includes basic
							information like your name and email address.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
							Data Usage
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							The information we collect is used to improve our services, personalize content, and provide
							customer support.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							Data Sharing
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							We do not share your personal information with third parties except as necessary to provide
							our services or as required by law.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							Security Measures
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							We take reasonable measures to protect your information from unauthorized access, use, or
							disclosure.
						</p>
					</section>

					<section className="mb-6 sm:mb-8">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
							<Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							Your Rights
						</h3>
						<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
							You have the right to access, correct, or delete your personal information. Contact us if
							you have any questions or concerns.
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

export default PrivacyPolicy;

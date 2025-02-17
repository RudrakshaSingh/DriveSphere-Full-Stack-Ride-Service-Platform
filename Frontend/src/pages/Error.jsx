import { Ghost, HomeIcon, ArrowLeft } from "lucide-react";

function Error() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full text-center">
				{/* Animated Ghost Icon */}
				<div className="relative mb-8">
					<Ghost size={120} className="mx-auto text-gray-400 animate-float" strokeWidth={1.5} />
					<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-200 rounded-full blur-sm animate-shadow" />
				</div>

				{/* Error Message */}
				<h1 className="text-7xl font-bold text-gray-800 mb-4 animate-fade-in">404</h1>
				<h2 className="text-2xl font-semibold text-gray-700 mb-4 animate-slide-up">Page Not Found</h2>
				<p className="text-gray-500 mb-8 animate-slide-up delay-100">
					Oops! The page you&apos;re looking for seems to have vanished into thin air.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
					<a
						href="/"
						className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300">
						<HomeIcon size={20} />
						<span>Go Home</span>
					</a>
					<button
						onClick={() => window.history.back()}
						className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
						<ArrowLeft size={20} />
						<span>Go Back</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Error;

const EmptyState = ({message}: {message: string}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg p-16 space-y-4 w-full mt-4">
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-24 h-24 text-gray-200"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m-3.2-3.2A6.5 6.5 0 1011 5.5a6.5 6.5 0 002.45 12.95z"
                    />
                    <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                    <path d="M9.5 15a3 3 0 003 0" strokeLinecap="round" />
                </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700">{message}</h2>
        </div>
  )
}

export default EmptyState
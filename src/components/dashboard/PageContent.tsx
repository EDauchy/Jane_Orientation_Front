import type { ReactNode } from 'react'

interface PageContentProps {
  children: ReactNode
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <div className="relative bg-white h-full w-full rounded-2xl">
      <button
        type="button"
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary text-white hover:text-black flex items-center justify-center transition-colors"
        aria-label="Fermer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {children}
    </div>
  )
}

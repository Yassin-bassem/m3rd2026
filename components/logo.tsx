import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#F472B6" />
          <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60A5FA" />
        </svg>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
        Baby Land
      </span>
    </Link>
  )
}

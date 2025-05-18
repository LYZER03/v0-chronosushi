import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-8 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
        Return to Home
      </Link>
    </div>
  )
}

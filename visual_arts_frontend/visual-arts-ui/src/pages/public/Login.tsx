import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export default function Login() {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account? <a href="/register" className="underline text-blue-600">Register</a>
      </p>
    </div>
  )
}

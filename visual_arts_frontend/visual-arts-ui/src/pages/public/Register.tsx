import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export default function Register() {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form className="space-y-4">
        <Input type="text" placeholder="Full Name" required />
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Input type="password" placeholder="Confirm Password" required />
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}

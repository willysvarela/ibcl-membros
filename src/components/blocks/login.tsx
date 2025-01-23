import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
const labels = {
  title: "Login",
  description: "Digite seu email abaixo para acessar sua conta",
  email: "Email",
  password: "Senha",
  loginButton: "Entrar",
  forgotPassword: "Esqueceu sua senha?",
  loginWithGoogle: "Entrar com Google",
  noAccount: "Não tem uma conta?",
  signUp: "Cadastre-se"
}

export function LoginForm({
  className,
  onLogin,
  status,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { onLogin: (e: React.FormEvent<HTMLFormElement>) => void, status: "invalid" | "loading" | null }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{labels.title}</CardTitle>
          <CardDescription>
            {labels.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => onLogin(e)}>
            <div className="flex flex-col gap-6">   
              <div className="grid gap-2">
                <Label htmlFor="email">{labels.email}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{labels.password}</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Carregando..." : labels.loginButton}
              </Button>
              {status === "invalid" && <p className="text-red-500">Email ou senha inválidos</p>}
              </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

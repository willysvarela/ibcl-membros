import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5 motion-preset-fade-sm">
      <h1 className="text-4xl font-bold">Cadastro IBCL 2025</h1>
      <Button asChild><Link href="/cadastro-ibcl" >Ir para Cadastro</Link></Button>
    </div>
  );
}

import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Criar conta — Cash Flow" };

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Crie sua conta</CardTitle>
        <CardDescription>
          Precisamos apenas de um nome e uma senha forte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}

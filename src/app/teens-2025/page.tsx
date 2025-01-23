"use client"
import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2Icon, InstagramIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { submitUser } from "./actions/submit"
import Confetti from "react-confetti"
import Link from "next/link"
import TeensAnimation from "@/components/layout/teensAnimation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  nomeAdolescente: z.string().min(1, "Nome do adolescente é obrigatório"),
  nomePai: z.string().optional(),
  nomeMae: z.string().min(1, "Nome da mãe é obrigatório"),
  contatoAdolescente: z.string().optional(),
  contatoPais: z.string().optional(),
  endereco: z.string().min(3, "O Endereço é obrigatório"),
  dataNascimento: z
    .date({
      required_error: "Data de nascimento é obrigatória",
    })
    .max(new Date(2015, 11, 31), "Data máxima permitida é 31/12/2015"),
  fotoAdolescente: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Foto do adolescente é obrigatória")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Tamanho máximo do arquivo é 5MB")
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Formato aceito: .jpg, .jpeg, .png e .webp"),
  fotoFamilia: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Foto da família é obrigatória")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Tamanho máximo do arquivo é 5MB")
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Formato aceito: .jpg, .jpeg, .png e .webp"),
})

export default function CadastroForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finished, setFinished] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeAdolescente: "",
      nomePai: "",
      nomeMae: "",
      contatoAdolescente: "",
      endereco: "",
      contatoPais: "",
      dataNascimento: undefined,
      fotoAdolescente: undefined,
      fotoFamilia: undefined,
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      // Create FormData object
      const formData = new FormData()
      formData.append("name", values.nomeAdolescente)
      formData.append("fatherName", values.nomePai || "")
      formData.append("motherName", values.nomeMae)
      formData.append("address", values.endereco)
      formData.append("phone", values.contatoAdolescente || "")
      formData.append("fathersPhone", values.contatoPais || "")
      formData.append("birthDate", values.dataNascimento.toISOString())
      formData.append("teenPhoto", values.fotoAdolescente[0])
      formData.append("familyPhoto", values.fotoFamilia[0])
      formData.append("department", "IBCL Teens")

      const response = await submitUser(formData)
      console.log({ response })

      if (response) {
        toast({
          title: "Sucesso!",
          description: "Usuário criado com sucesso",
        })
        // form.reset()
        setFinished(true)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar usuário",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderAnimation = () => {
    return <div className="sticky top-0 bg-white py-5 flex flex-col gap-5">
      <TeensAnimation />
      <h1 className="text-2xl font-bold text-center">Cadastro IBCL Teens 2025</h1>
    </div>
  }

  if (finished) {
    return <div>
      <Confetti width={window.innerWidth} height={window.innerHeight}  />
      <div className={`max-w-2xl mx-auto h-screen flex flex-col justify-center motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md`}>
      <h1 className="text-4xl font-bold text-center mb-6">Cadastro finalizado</h1>
      <p className="text-center text-sm text-gray-900 mb-6">Obrigado por atualizar seu cadastro.</p>
      <p className="text-center text-sm text-gray-900 mb-6">Prepare-se para um ano incrível no IBCL Teens.</p>
      <Button asChild variant="outline">
        <Link href="https://www.instagram.com/ibclteens/" target="_blank"><InstagramIcon className="w-4 h-4" />
        @ibclteens</Link>
      </Button>
    </div>
    </div>
  }

  return (
    <div className="mt-20 motion-preset-fade-lg">
      {renderAnimation()}
    <div className="max-w-2xl mx-auto p-6 mb-24">
      <p className="text-center text-sm text-gray-900 mb-6">Preencha o formulário abaixo para cadastrar o adolescente.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nomeAdolescente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Adolescente *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomePai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Pai</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="nomeMae"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Mãe *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o endereço completo (ex: Rua das Flores, 123, Ouro Verde)" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contatoAdolescente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato do Adolescente</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" type="tel" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Número de telefone para contato</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contatoPais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato do Pai ou Mãe</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" type="tel" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Número de telefone para contato</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "P", { locale: ptBR }) : <span>Selecione uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date(2015, 11, 31) || date > new Date()}
                      initialFocus
                      locale={ptBR}
                      captionLayout="dropdown-buttons"
                      fromYear={1990}
                      toYear={2015}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Data máxima permitida: 31/12/2015</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fotoAdolescente"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Foto do Adolescente *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => onChange(e.target.files)}
                    value={undefined}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Formatos aceitos: JPG, JPEG, PNG e WEBP. Tamanho máximo: 5MB</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fotoFamilia"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Foto da Família *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => onChange(e.target.files)}
                    value={undefined}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Formatos aceitos: JPG, JPEG, PNG e WEBP. Tamanho máximo: 5MB</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size={"lg"} type="submit" className={cn("w-full", isSubmitting && "opacity-50 cursor-not-allowed")} >
            {isSubmitting ? <><Loader2Icon className="w-4 h-4 animate-spin" /> Enviando...</> :
              "Enviar Cadastro"}
          </Button>
        </form>
      </Form>
    </div>
    </div>
  )
}


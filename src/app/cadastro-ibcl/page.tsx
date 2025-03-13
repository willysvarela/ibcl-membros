"use client"
import { useState, useEffect } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import logoIBCL from "@/../public/logo-ibcl.png"
import Image from "next/image"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  nomePai: z.string().optional(),
  nomeMae: z.string().optional(),
  contato: z.string().min(1, "Contato é obrigatório"),
  contatoPais: z.string().optional(),
  dataNascimento: z
    .string({
      required_error: "Data de nascimento é obrigatória",
    }),
  foto: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Foto é obrigatória")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Tamanho máximo do arquivo é 5MB")
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Formato aceito: .jpg, .jpeg, .png e .webp"),
  tipoMembro: z.enum(["Batizado", "Aclamado", "Carta", "Visitante"], {
    required_error: "Tipo de membro é obrigatório",
  }),
  estadoCivil: z.enum(["Solteiro", "Viuvo", "Casado", "Divorciado"], {
    required_error: "Estado civil é obrigatório",
  }),
  dataCasamento: z.string().optional(),
  grupo: z.string().optional(),
  ministerios: z.string().optional(),
})

export default function CadastroForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finished, setFinished] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Update window size for Confetti component
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      nomePai: "",
      nomeMae: "",
      contato: "",
      contatoPais: "",
      dataNascimento: undefined,
      foto: undefined,
      tipoMembro: "Visitante",
      estadoCivil: "Solteiro",
      dataCasamento: undefined,
      grupo: "",
      ministerios: "",
    },
  })

  // Show/hide marriage date field based on civil status
  const showMarriageDate = form.watch("estadoCivil") === "Casado"

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      // Create FormData object
      const formData = new FormData()
      formData.append("name", values.nome)
      formData.append("fatherName", values.nomePai || "")
      formData.append("motherName", values.nomeMae || "")
      formData.append("phone", values.contato)
      formData.append("fathersPhone", values.contatoPais || "")
      formData.append("birthDate", values.dataNascimento)
      formData.append("photo", values.foto[0])
      formData.append("department", "IBCL")
      formData.append("membershipType", values.tipoMembro)
      formData.append("civilStatus", values.estadoCivil)
      if (values.dataCasamento) {
        formData.append("engagementDate", values.dataCasamento)
      }
      formData.append("group", values.grupo || "")
      formData.append("ministries", values.ministerios || "")

      const response = await submitUser(formData)

      if (response) {
        toast({
          title: "Sucesso!",
          description: "Cadastro criado com sucesso",
        })
        setFinished(true)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar cadastro",
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

  const renderHeader = () => {
    return <div className="sticky top-0 bg-white py-5 flex flex-col gap-5">
      <div className="flex justify-center">
        <img src={logoIBCL.src} alt="Logo IBCL" className="h-20" />
      </div>
    </div>
  }
  
  if (finished) {
      return <div>
      <Confetti width={windowSize.width} height={windowSize.height} />
      <div className={`max-w-2xl mx-auto h-screen flex flex-col justify-center motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md`}>
        <h1 className="text-4xl font-bold text-center mb-6">Cadastro finalizado</h1>
        <p className="text-center text-sm text-gray-900 mb-6">Obrigado por atualizar seu cadastro.</p>
        <Button asChild variant="outline">
          <Link href="https://www.instagram.com/ibcentralleste/" target="_blank"><InstagramIcon className="w-4 h-4" />
            Acompanhe as novidades no @ibcentralleste</Link>
        </Button>
      </div>
    </div>
  }

  return (
    <div className="mt-20 motion-preset-fade-lg">
      {renderHeader()}
      <div className="max-w-2xl mx-auto p-6 mb-24">
      <h1 className="text-2xl font-bold text-center">Cadastro IBCL</h1>
        <p className="text-center text-sm text-gray-900 mb-6">Preencha o formulário abaixo para realizar seu cadastro.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato *</FormLabel>
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
                  <FormControl>
                    <Input placeholder="dd/MM/YYYY" type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoMembro"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Como se tornou membro da igreja? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Batizado" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Batizado
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Aclamado" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Aclamado
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Carta" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Carta
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Visitante" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Visitante
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estadoCivil"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Estado Civil *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Solteiro" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Solteiro
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Casado" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Casado
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Viuvo" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Viúvo
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Divorciado" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Divorciado
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showMarriageDate && (
              <FormField
                control={form.control}
                name="dataCasamento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Casamento</FormLabel>
                    <FormControl>
                      <Input placeholder="dd/MM/YYYY" type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="grupo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faz parte de algum GCO ou GA? Se sim, qual?</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do grupo" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ministerios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faz parte de algum Ministério? Se sim, qual?</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite os ministérios" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foto"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Sua Foto *</FormLabel>
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

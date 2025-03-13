"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { fetchTeens } from "./actions/fetchTeens";
import TeensAnimation from "@/components/layout/teensAnimation";
import Image from "next/image";
import { User } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPhotoDialog } from "@/components/blocks/user-photo-dialog";

const DashboardPage = () => {
    const [search, setSearch] = useState("");
    const [teens, setTeens] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log("fetching teens");
        setLoading(true);
        fetchTeens().then((teens) => {
            console.log("teens fetched", teens);
            setTeens(teens);
            setLoading(false);
        }).catch((error) => {
            setError(true);
            setLoading(false);
        });
    }, []);

    const formatDate = (date: Date) => {
        // add 12 hours to the date
        const newDate = new Date(date.getTime() + 12 * 60 * 60 * 1000);
        return newDate.toLocaleDateString();
    }

    if (loading) {
        return <div>
            <div className="flex justify-center items-center min-h-screen">
                <TeensAnimation />
            </div>
        </div>
    }

    if (error) {
        return <div>
            <div className="flex flex-col gap-6 justify-center items-center min-h-screen">
                <p>Ocorreu um erro ao carregar os adolescentes</p>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
        </div>
    }

    const filteredTeens = teens.filter((teen) => teen.name.toLowerCase().includes(search.toLowerCase()));
    return <div className="py-10 px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-col gap-4 items-center mt-10">
            <div className="w-full">
                <Input className="w-full" placeholder="Procurar Membro" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Table className="hidden md:table">
                <TableHeader>
                    <TableRow>
                        <TableHead>Foto</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Estado Civil</TableHead>
                        <TableHead>Data de Nascimento</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Ministérios</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTeens.map((teen) => (
                        <TableRow key={teen.id}>
                            <TableCell>
                                <UserPhotoDialog teen={teen} />
                            </TableCell>

                            <TableCell>{teen.name}</TableCell>
                            <TableCell>{teen.phone}</TableCell>
                            <TableCell>{teen.civilStatus} {teen.engagementDate ? ` - ${formatDate(teen.engagementDate)}` : ""}</TableCell>
                            <TableCell>{formatDate(teen.birthDate)}</TableCell>
                            <TableCell>{teen.group}</TableCell>
                            <TableCell>{teen.ministries}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-2 items-center">
                                    <Button variant="outline" onClick={() => window.open(`https://wa.me/${teen.phone}`, '_blank')}>Falar no Whatsapp</Button>
                                </div>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="block md:hidden">
                {filteredTeens.map((teen) => (
                    <Card key={teen.id} className="mb-4">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <UserPhotoDialog teen={teen} />
                            <div>
                                <CardTitle>{teen.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <div>
                                <span className="font-semibold">Telefone:</span> {teen.phone}
                            </div>
                            <div>
                                <span className="font-semibold">Estado Civil:</span> {teen.civilStatus} {teen.engagementDate ? ` - ${formatDate(teen.engagementDate)}` : ""}
                            </div>
                            <div>
                                <span className="font-semibold">Data de Nascimento:</span> {formatDate(teen.birthDate)}
                            </div>
                            <div>
                                <span className="font-semibold">Grupo:</span> {teen.group}
                            </div>
                            <div>
                                <span className="font-semibold">Ministérios:</span> {teen.ministries}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full mt-2"
                                    onClick={() => window.open(`https://wa.me/${teen.phone}`, '_blank')}
                                >
                                    Falar no Whatsapp
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>


    </div>;
};

export default DashboardPage;

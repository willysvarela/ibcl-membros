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

    if(loading) {
        return <div>
            <div className="flex justify-center items-center min-h-screen">
                <TeensAnimation />
            </div>
        </div>
    }

    if(error) {
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
                <Input className="w-full" placeholder="Procurar Adolescente" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Table className="hidden md:table">
                <TableHeader>
                    <TableRow>
                        <TableHead>Foto</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Nome do Pai</TableHead>
                        <TableHead>Nome da Mãe</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Data de Nascimento</TableHead>
                        <TableHead>Telefone do Pai</TableHead>
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
                            <TableCell>{teen.department}</TableCell>
                            <TableCell>{teen.fatherName}</TableCell>
                            <TableCell>{teen.motherName}</TableCell>
                                <TableCell>
                                <a className="text-blue-500 underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(teen.address)}`} target="_blank" rel="noopener noreferrer">
                                        {teen.address}
                                    </a>
                                </TableCell>
                            <TableCell>{new Date(teen.birthDate).toLocaleDateString()}</TableCell>
                            <TableCell>{teen.fathersPhone}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-2 items-center">
                                    <Button variant="outline" onClick={() => window.open(`https://wa.me/${teen.phone}`, '_blank')}>Falar no Whatsapp</Button>
                                    <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => window.open(`https://wa.me/${teen.fathersPhone}`, '_blank')}
                            >
                                Falar com Pais no Whatsapp
                            </Button>
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
                                <p className="text-sm text-muted-foreground">{teen.department}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <div>
                                <span className="font-semibold">Telefone:</span> {teen.phone}
                            </div>
                            <div>
                                <span className="font-semibold">Pais:</span> {teen.fatherName} e {teen.motherName}
                            </div>
                            <div>
                                <span className="font-semibold">Endereço:</span>
                                    <a className="text-blue-500 underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(teen.address)}`} target="_blank" rel="noopener noreferrer">
                                        {teen.address}
                                    </a>
                            </div>
                            <div>
                                <span className="font-semibold">Data de Nascimento:</span> {new Date(teen.birthDate).toLocaleDateString()}
                            </div>
                            <div>
                                <span className="font-semibold">Telefone dos Pais:</span> {teen.fathersPhone}
                            </div>
                            <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => window.open(`https://wa.me/${teen.phone}`, '_blank')}
                            >
                                Falar no Whatsapp
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => window.open(`https://wa.me/${teen.fathersPhone}`, '_blank')}
                            >
                                    Falar com Pais no Whatsapp
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

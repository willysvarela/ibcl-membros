import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { User } from "@prisma/client"
import Image from "next/image"
import React from "react"

export const UserPhotoDialog: React.FC<{ teen: Partial<User> }> = ({ teen }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Image src={teen.photo || ""} alt={teen.name || ""} className="w-10 h-10 rounded-full" width={100} height={100} />
                    <span className="text-sm text-muted-foreground">Ver Fotos</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{teen.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <div className="flex flex-row gap-2">
                        <Image src={teen.photo || ""} alt={teen.name || ""} className="w-full h-full rounded-sm" width={300} height={300} />
                        <Image src={teen.familyPhoto || ""} alt={teen.name || ""} className="w-full h-full rounded-sm" width={300} height={300} />
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

"use server"
import { prisma } from "@/lib/prisma"
import supabase from "@/lib/supabase"
import { User } from "@prisma/client"
import sharp from "sharp"

export const submitUser = async (formData: FormData) => {
    
    const user: Partial<User> = {
        name: formData.get("name")! as string,
        phone: formData.get("phone") as string,
        department: formData.get("department") as string,
        fatherName: formData.get("fatherName") as string,
        motherName: formData.get("motherName") as string,
        address: formData.get("address") as string,
        birthDate: new Date(formData.get("birthDate") as string),
        photo: "",
        familyPhoto: "",
        fathersPhone: formData.get("fathersPhone") as string,

    }
    const result = await createUser(user)

    if(!result) {
        return { success: false, message: "Erro ao criar usuário" }
    }
    const photoBlob = formData.get("photo") as File
    const familyPhotoBlob = formData.get("familyPhoto") as File

    const teenPhoto = new Blob([photoBlob], { type: photoBlob.type })
    const familyPhoto = new Blob([familyPhotoBlob], { type: familyPhotoBlob.type })
    const resultUpdate = await updateUserPhotos(result, teenPhoto, familyPhoto)

    if(!resultUpdate) {
        return null
    }

    return result
}

const uploadPhoto = async (photo: Blob) => {
    try {
        // optimize photo size with sharp
        const buffer = await photo.arrayBuffer()
        const optimizedPhoto = await sharp(buffer).resize(300, 300).toBuffer()
        //  upload to supabase
        const blob = new Blob([optimizedPhoto], { type: photo.type })
        const { data, error } = await supabase.storage.from("ibcl-users-images").upload(`${new Date().getTime()}.jpg`, blob)
        if (error) {
            console.error(error)
            throw new Error("Erro ao enviar a foto")
        }
        return data.fullPath
    } catch (error) {
        console.error(error)
        throw new Error("Erro ao enviar a foto - " + error)
    }
}

const updateUserPhotos = async (user: Partial<User>, familyPhoto: Blob, photo: Blob) => {
    try {
        const familyPhotoURL = await uploadPhoto(familyPhoto)
        const photoURL = await uploadPhoto(photo)

    const result = await prisma.user.update({
        where: { id: user.id },
            data: { photo: photoURL!, familyPhoto: familyPhotoURL! }
        })
        return result
    } catch (error) {
        console.error(error)
        return null
    }
}

const createUser = async (user: Partial<User>) => {
    try {
        console.log("Creating User")
        const result = await prisma.user.create({
            data: {
                name: user.name!,
                phone: user.phone!,
                department: user.department!,
                fatherName: user.fatherName!,
                motherName: user.motherName!,
                address: user.address!,
                birthDate: new Date(user.birthDate!),
                photo: user.photo!,
                familyPhoto: user.familyPhoto!,
                fathersPhone: user.fathersPhone!

            },
        });
        console.log(user.id + " created")
        if(result) {
            return result
        } else {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
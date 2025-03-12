"use server"
// fetch teens from supabase database

import { prisma } from "@/lib/prisma";
import supabase from "@/lib/supabase";

export const fetchTeens = async () => {
    try {
        const teens = await prisma.user.findMany();

        const teensWithPhotos = await Promise.all(teens.map(async (teen) => {
            supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_ID || "").getPublicUrl(teen.photo, {
                
            })
            const teenPhotoUrl = await supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_ID || "").getPublicUrl(teen.photo || "");
            const familyPhotoUrl = await supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_ID || "").getPublicUrl(teen.familyPhoto || "");

            const teenPhoto = fixUrl(teenPhotoUrl.data.publicUrl);
            const familyPhoto = fixUrl(familyPhotoUrl.data.publicUrl);

            console.log({teenPhoto, familyPhoto})
            return { ...teen, photo: teenPhoto, familyPhoto: familyPhoto };
        }));

        console.log("teens fetched", teensWithPhotos);
        return teensWithPhotos;
    } catch (error) {
        console.error('Error fetching teens:', error);
        throw new Error('Error fetching teens');
    }
}

const fixUrl = (url: string) => {
    const urlParts = url.split('/');
    const uniqueParts = Array.from(new Set(urlParts));
    return uniqueParts.join('/');
};
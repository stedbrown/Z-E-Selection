'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();

    const itemId = formData.get('itemId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const country = formData.get('country') as string;
    const message = formData.get('message') as string;
    const city = formData.get('city') as string;

    if (!name || !email || !itemId) {
        return { error: 'Name, Email and Item ID are required' };
    }

    try {
        const { error: dbError } = await supabase
            .from('contacts')
            .insert({
                item_id: itemId,
                name,
                email, // Added email here
                phone,
                address,
                country,
                message, // Added message from upstream
                status: 'pending'
            });

        if (dbError) {
            console.error('Error saving to DB (continuing to email):', dbError);
        }
    } catch (e) {
        console.error('Exception saving to DB:', e);
    }

    // --- NODEMAILER CONFIGURATION ---
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Optional city included in the address line
        const fullAddress = [address, city].filter(Boolean).join(', ');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: 'info@zeselection.com',
            replyTo: email,
            subject: `Nuova richiesta Info da ${name} - Oggetto ZE-${itemId.slice(0, 6).toUpperCase()}`,
            html: `
                <h2>Nuova richiesta ricevuta dal sito</h2>
                <p><strong>Oggetto:</strong> <a href="https://www.zeselection.com/item/${itemId}">Vedi sul sito (ZE-${itemId.slice(0, 6).toUpperCase()})</a></p>
                <hr />
                <h3>Dati Cliente:</h3>
                <ul>
                    <li><strong>Nome:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Telefono:</strong> ${phone || 'Non fornito'}</li>
                    <li><strong>Indirizzo:</strong> ${fullAddress || 'Non fornito'}</li>
                    <li><strong>Nazione:</strong> ${country || 'Non fornita'}</li>
                </ul>
                <hr />
                <p><em>Puoi rispondere direttamente a questa email per contattare ${name}.</em></p>
            `,
        };

        await transporter.sendMail(mailOptions);

    } catch (emailError: any) {
        console.error('Error sending email:', emailError);
        return { error: 'Failed to send email' };
    }

    revalidatePath(`/item/${itemId}`);
    return { success: true };
}

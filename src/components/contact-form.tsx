'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from '@/actions/contact';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
    itemId: string;
    t: any;
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center h-[54px] bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-sm gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
            {pending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}

export function ContactForm({ itemId, t }: ContactFormProps) {
    const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');

    async function handleSubmit(formData: FormData) {
        setState('idle');
        const result = await submitContactForm(formData);
        if (result.success) {
            setState('success');
        } else {
            setState('error');
        }
    }

    if (state === 'success') {
        return (
            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="text-green-800 font-medium">
                    {t.successMessage}
                </p>
                <button 
                    onClick={() => setState('idle')}
                    className="text-sm text-green-700 underline underline-offset-4 hover:text-green-900"
                >
                    Invia un'altra richiesta
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 tracking-[0.15em] uppercase flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#B49E78] shrink-0" />
                    {t.contactTitle}
                </h3>
            </div>
            
            <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="itemId" value={itemId} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome e Cognome */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {t.fullName} *
                        </label>
                        <input
                            required
                            name="name"
                            placeholder="es. Mario Rossi"
                            className="w-full h-14 px-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none shadow-sm"
                        />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {t.emailLabel} *
                        </label>
                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="info@esempio.it"
                            className="w-full h-14 px-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none shadow-sm"
                        />
                    </div>

                    {/* Telefono */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {t.phoneNumber}
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="+41 ..."
                            className="w-full h-14 px-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none shadow-sm"
                        />
                    </div>

                    {/* Paese / Nazione */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {t.nation}
                        </label>
                        <input
                            name="country"
                            placeholder="es. Svizzera"
                            className="w-full h-14 px-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none shadow-sm"
                        />
                    </div>

                    {/* Indirizzo + Città & Cap (Piatto) */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {t.address}
                        </label>
                        <input
                            name="address"
                            placeholder="Via e numero civico"
                            className="w-full h-14 px-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {t.country}
                        </label>
                        <input
                            name="city"
                            placeholder="Città, CAP"
                            className="w-full h-14 px-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none shadow-sm"
                        />
                    </div>
                </div>

                {/* Messaggio / Note */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        {t.message}
                    </label>
                    <textarea
                        name="message"
                        rows={3}
                        placeholder="Scrivi qui eventuali domande o note aggiuntive..."
                        className="w-full min-h-[120px] p-5 bg-white border border-gray-100 focus:border-[#B49E78] focus:ring-1 focus:ring-[#B49E78]/5 rounded-2xl text-sm transition-all outline-none resize-none shadow-sm"
                    />
                </div>

                <div className="pt-4 px-2">
                    <SubmitButton label={t.sendEmail} />
                    <p className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed font-light tracking-wide italic">
                        Premendo invia confermi di voler essere ricontattato via email o telefono per questo articolo specifico. 
                    </p>
                </div>

                {state === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-xs mt-3 justify-center bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                        <AlertCircle className="w-4 h-4" />
                        <span>{t.errorMessage}</span>
                    </div>
                )}
            </form>
        </div>
    );
}

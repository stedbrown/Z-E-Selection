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
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-[#faf9f7]/50">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {t.contactTitle}
                </h3>
            </div>
            
            <form action={handleSubmit} className="p-5 space-y-4">
                <input type="hidden" name="itemId" value={itemId} />
                
                <div className="space-y-4">
                    {/* Nome e Cognome */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                            {t.fullName} *
                        </label>
                        <input
                            required
                            name="name"
                            placeholder="es. Mario Rossi"
                            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-sm transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Telefono */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                                {t.phoneNumber}
                            </label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="+41 ..."
                                className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-sm transition-all outline-none"
                            />
                        </div>
                        {/* Paese / Nazione */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                                {t.nation}
                            </label>
                            <input
                                name="country"
                                placeholder="es. Svizzera"
                                className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-sm transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Indirizzo + Città & Cap */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                {t.address}
                            </label>
                            <input
                                name="address"
                                placeholder="Via e numero civico"
                                className="w-full px-0 bg-transparent border-b border-gray-200 focus:border-gray-900 text-sm transition-all outline-none pb-1"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                {t.country}
                            </label>
                            <input
                                name="city"
                                placeholder="Città, CAP"
                                className="w-full px-0 bg-transparent border-b border-gray-200 focus:border-gray-900 text-sm transition-all outline-none pb-1"
                            />
                        </div>
                    </div>

                    {/* Messaggio / Note */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                            {t.message}
                        </label>
                        <textarea
                            name="message"
                            rows={3}
                            placeholder="Scrivi qui eventuali domande o note aggiuntive..."
                            className="w-auto min-h-[100px] w-full p-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-sm transition-all outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <SubmitButton label={t.sendEmail} />
                </div>

                {state === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-xs mt-2 justify-center">
                        <AlertCircle className="w-4 h-4" />
                        <span>{t.errorMessage}</span>
                    </div>
                )}

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Premendo invia confermi di voler essere ricontattato via email o telefono per questo articolo specifico. 
                </p>
            </form>
        </div>
    );
}

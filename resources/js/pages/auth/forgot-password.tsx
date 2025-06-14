// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, KeyRound, CheckCircle2, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout 
            title="Forgot Password" 
            description="Enter your email address and we'll send you a link to reset your password."
        >
            <Head title="Forgot password" />

            <div className="w-full max-w-md mx-auto">
                {/* Password Reset Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
                            <KeyRound className="w-10 h-10 text-slate-600" />
                        </div>
                        {status && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-800 mb-1">
                                    Reset Link Sent!
                                </h4>
                                <p className="text-sm text-emerald-700">
                                    {status}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="text-center mb-8">
                    <p className="text-slate-600 leading-relaxed">
                        Enter your email address and we'll send you a secure link to reset your password.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <Button 
                        disabled={processing} 
                        className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                                Sending reset link...
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4 mr-2" />
                                Email password reset link
                            </>
                        )}
                    </Button>

                    <div className="text-center pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500 mb-3">
                            Remember your password?
                        </p>
                        <TextLink 
                            href={route('login')} 
                            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors duration-200"
                        >
                            Return to log in
                        </TextLink>
                    </div>
                </form>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">
                        Having trouble?
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Make sure you enter the email address associated with your account</li>
                        <li>• Check your spam or junk mail folder for the reset email</li>
                        <li>• The reset link will expire after 60 minutes for security</li>
                        <li>• Contact support if you continue having issues</li>
                    </ul>
                </div>
            </div>
        </AuthLayout>
    );
}
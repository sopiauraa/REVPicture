// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout 
            title="Verify Your Email Address" 
            description="Please verify your email address by clicking on the link we just emailed to you to complete your account setup."
        >
            <Head title="Email Verification" />

            <div className="w-full max-w-md mx-auto">
                {/* Email Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
                            <Mail className="w-10 h-10 text-slate-600" />
                        </div>
                        {status === 'verification-link-sent' && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {status === 'verification-link-sent' && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-800 mb-1">
                                    Verification Email Sent!
                                </h4>
                                <p className="text-sm text-emerald-700">
                                    A new verification link has been sent to your email address. Please check your inbox and click the link to verify your account.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="text-center mb-8">
                    <p className="text-slate-600 leading-relaxed">
                        We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the verification link to activate your account.
                    </p>
                </div>

                {/* Action Buttons */}
                <form onSubmit={submit} className="space-y-4">
                    <Button 
                        disabled={processing} 
                        className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                                Sending verification email...
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4 mr-2" />
                                Resend verification email
                            </>
                        )}
                    </Button>

                    <div className="text-center pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500 mb-3">
                            Wrong email address or need to use a different account?
                        </p>
                        <TextLink 
                            href={route('logout')} 
                            method="post" 
                            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors duration-200"
                        >
                            Log out and try again
                        </TextLink>
                    </div>
                </form>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">
                        Didn't receive the email?
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Check your spam or junk mail folder</li>
                        <li>• Make sure you entered the correct email address</li>
                        <li>• Click "Resend verification email" to try again</li>
                        <li>• Contact support if you continue having issues</li>
                    </ul>
                </div>
            </div>
        </AuthLayout>
    );
}
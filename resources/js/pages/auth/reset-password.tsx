import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Shield, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Reset Your Password" 
            description="Please enter your new password below to secure your account."
        >
            <Head title="Reset password" />

            <div className="w-full max-w-md mx-auto">
                {/* Shield Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
                        <Shield className="w-10 h-10 text-slate-600" />
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-center mb-8">
                    <p className="text-slate-600 leading-relaxed">
                        Create a strong, secure password for your account. Make sure it's something you'll remember but others can't guess.
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
                            autoComplete="email"
                            value={data.email}
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                            New password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter your new password"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                            Confirm new password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirm your new password"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                                Resetting password...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 mr-2" />
                                Reset password
                            </>
                        )}
                    </Button>
                </form>

                {/* Security Tips */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">
                        Password Security Tips
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                        <li>• Avoid using personal information like your name or birthdate</li>
                        <li>• Don't reuse passwords from other accounts</li>
                        <li>• Consider using a password manager for better security</li>
                    </ul>
                </div>
            </div>
        </AuthLayout>
    );
}
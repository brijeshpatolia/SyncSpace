import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const SignInCard = () => {
    const navigate = useNavigate();
    const [signInForm, setSignInForm] = useState({
        email: '',
        password: '',
    });

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Welcome back! Sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-3">
                    <Input
                        placeholder="Email"
                        required
                        onChange={(e) =>
                            setSignInForm({ ...signInForm, email: e.target.value })
                        }
                        value={signInForm.email}
                        type="email"
                    />

                    <Input
                        placeholder="Password"
                        required
                        onChange={(e) =>
                            setSignInForm({ ...signInForm, password: e.target.value })
                        }
                        value={signInForm.password}
                        type="password"
                    />

                    <Button size="lg" type="submit" className="w-full">
                        Sign In
                    </Button>

                    <Separator className="my-5" />

                    <p className="text-sm text-muted-foreground mt-4">
                        Don’t have an account?{' '}
                        <span
                            className="text-sky-600 hover:underline cursor-pointer"
                            onClick={() => navigate('/auth/signup')}
                        >
                            Sign Up
                        </span>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
};


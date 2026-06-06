'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AlertCircle, Eye, EyeOff, GraduationCap, Lock, Mail, User } from 'lucide-react';

import { getDashboardPath, useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
    role: z.enum(['STUDENT', 'TEACHER']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'Learn from courses and track progress',
    icon: GraduationCap,
  },
  {
    value: 'TEACHER',
    label: 'Teacher',
    description: 'Create courses and manage learners',
    icon: User,
  },
] as const;

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === 'string') {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Registration failed. Please check your details and try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null);

    try {
      const user = await registerUser(data.name, data.email, data.password, data.role);
      toast.success('Account created successfully!');
      router.replace(getDashboardPath(user.role));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setFormError(message);
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-white">Create an account</h2>
      <p className="mb-6 text-sm text-gray-400">Join the REC Digital Learning Ecosystem</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div
            className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Input
          label="Name"
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-500 transition-colors hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Role
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;

              return (
                <label
                  key={role.value}
                  className={cn(
                    'cursor-pointer rounded-lg border p-3 transition-colors',
                    'bg-dark-700/40 hover:border-primary-500/40',
                    isSelected
                      ? 'border-primary-500/70 ring-1 ring-primary-500/30'
                      : 'border-white/10',
                  )}
                >
                  <input
                    type="radio"
                    value={role.value}
                    className="sr-only"
                    {...register('role')}
                  />
                  <span className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 rounded-md p-1.5',
                        isSelected ? 'bg-primary-600 text-white' : 'bg-dark-600 text-gray-400',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-white">
                        {role.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                        {role.description}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.role?.message && (
            <p className="mt-1.5 text-sm text-red-400" role="alert">
              {errors.role.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting || isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary-400 transition-colors hover:text-primary-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}

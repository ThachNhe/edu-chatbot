import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { forgotPasswordSchema } from '@/lib/validations/auth.schema'
import { ROUTES } from '@/lib/constants'
import { useForgotPassword } from '../hooks/useLogin'
import type { ForgotPasswordFormValues } from '../types/auth.types'

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)
  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values, {
      onSuccess: () => setSubmitted(true),
    })
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
            ✉️
          </div>
          <CardTitle className="text-xl font-bold">Kiểm tra email</CardTitle>
          <CardDescription>
            Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu.
            Vui lòng kiểm tra hộp thư.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="mr-2 size-4" />
                  Gửi link đặt lại mật khẩu
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Quay lại đăng nhập
        </Link>
      </CardFooter>
    </Card>
  )
}
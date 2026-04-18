'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createPremiumAction } from '@/app/actions';
import type { createPremiumActionBody } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const payModes = ['upi', 'team', 'pay'];

export default function CreatePremiumForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState<createPremiumActionBody>({
    userMail: '',
    amount: 0,
    payMode: 'upi',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePayModeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      payMode: value,
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const result = await createPremiumAction(formData);

      if (!result) {
        toast.error('Something went wrong. Please try again.');
        return;
      }

      if (result.success) {
        toast.success(result.message || 'Premium created successfully');
        router.push('/admin/premium');
        router.refresh();
      } else {
        if ('errors' in result && result.errors) {
          const newErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, message]) => {
            newErrors[key] = Array.isArray(message) ? message[0] : (message as string);
          });
          setErrors(newErrors);
          toast.error('Please fix the errors in the form.');
        } else if ('error' in result) {
          toast.error(result.error || 'Failed to create premium');
        }
      }
      // oxlint-disable-next-line no-unused-vars
    } catch (_error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="userMail">User Email</Label>
        <Input
          id="userMail"
          name="userMail"
          type="email"
          value={formData.userMail}
          onChange={handleChange}
          placeholder="Enter user email"
          className={errors.userMail ? 'border-destructive' : ''}
        />
        {errors.userMail && <p className="text-destructive text-sm font-medium">{errors.userMail}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className={errors.amount ? 'border-destructive' : ''}
        />
        {errors.amount && <p className="text-destructive text-sm font-medium">{errors.amount}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="payMode">Pay Mode</Label>
        <Select name="payMode" onValueChange={handlePayModeChange} value={formData.payMode}>
          <SelectTrigger>
            <SelectValue placeholder="Select pay mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {payModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.payMode && <p className="text-destructive text-sm font-medium">{errors.payMode}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Premium'}
      </Button>
    </form>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { updateComicAction } from '@/app/actions';
import type { ReqType } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UpdateComicFormProps {
  initialData: ReqType;
}

export function UpdateComicForm({ initialData }: UpdateComicFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setFormData((prev) => ({
      ...prev,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      languageCode: value,
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const result = await updateComicAction(formData);

      if (!result) {
        toast.error('Something went wrong. Please try again.');
        return;
      }

      if (result.success) {
        toast.success(result.message || 'Comic updated successfully');
        router.refresh();
      } else {
        if ('errors' in result && result.errors) {
          // Handle field-specific errors from server
          const newErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, message]) => {
            newErrors[key] = Array.isArray(message) ? message[0] : (message as string);
          });
          setErrors(newErrors);
          toast.error('Please fix the errors in the form.');
        } else if ('error' in result) {
          toast.error(result.error || 'Failed to update comic');
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Comic Title"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-sm font-medium text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="comic-slug"
          className={errors.slug ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">The unique URL-friendly identifier.</p>
        {errors.slug && <p className="text-sm font-medium text-destructive">{errors.slug}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell us about this comic..."
          className={`min-h-30 ${errors.description ? 'border-destructive' : ''}`}
        />
        {errors.description && <p className="text-sm font-medium text-destructive">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://..."
          className={errors.coverImage ? 'border-destructive' : ''}
        />
        {errors.coverImage && <p className="text-sm font-medium text-destructive">{errors.coverImage}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="languageCode">Language Code</Label>
          <Select name="languageCode" onValueChange={handleLanguageChange} value={formData.languageCode}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select Language Code" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {siteConfig.languageCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors.languageCode && <p className="text-sm font-medium text-destructive">{errors.languageCode}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4 border rounded-lg p-4 bg-muted/20">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Published</Label>
            <p className="text-xs text-muted-foreground">Whether this comic is visible to the public.</p>
          </div>
          <Switch
            checked={formData.published}
            onCheckedChange={(checked) => handleSwitchChange('published', checked)}
          />
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Adult Content</Label>
            <p className="text-xs text-muted-foreground">Mark if this comic contains mature content.</p>
          </div>
          <Switch checked={formData.isAdult} onCheckedChange={(checked) => handleSwitchChange('isAdult', checked)} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Comic'}
      </Button>
    </form>
  );
}

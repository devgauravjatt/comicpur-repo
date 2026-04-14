'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { createComicAction } from '@/app/actions';
import type { createComicActionBody } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';

interface CreateComicFormProps {
  categories: { id: number; name: string }[];
}

export default function CreateComicForm({ categories }: CreateComicFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState<createComicActionBody>({
    title: '',
    description: '',
    coverImage: '',
    languageCode: 'hi',
    slug: '',
    categoryIds: [],
    published: true,
    isAdult: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleCategoryChange = (value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: value.map((id) => Number(id)),
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const result = await createComicAction(formData);

      if (!result) {
        toast.error('Something went wrong. Please try again.');
        return;
      }

      if (result.success) {
        toast.success(result.message || 'Comic created successfully');
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
          toast.error(result.error || 'Failed to create comic');
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Comic Title"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-destructive text-sm font-medium">{errors.title}</p>}
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
        <p className="text-muted-foreground text-xs">The unique URL-friendly identifier.</p>
        {errors.slug && <p className="text-destructive text-sm font-medium">{errors.slug}</p>}
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
        {errors.description && <p className="text-destructive text-sm font-medium">{errors.description}</p>}
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
        {errors.coverImage && <p className="text-destructive text-sm font-medium">{errors.coverImage}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

          {errors.languageCode && <p className="text-destructive text-sm font-medium">{errors.languageCode}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryIds">Categories</Label>
        <MultiSelect
          onValuesChange={handleCategoryChange}
          defaultValues={formData.categoryIds?.map((id) => id.toString()) || []}
        >
          <MultiSelectTrigger className="w-full max-w-100">
            <MultiSelectValue placeholder="Select categories..." />
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelectGroup>
              {categories.map((category) => (
                <MultiSelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>
        {errors.categoryIds && <p className="text-destructive text-sm font-medium">{errors.categoryIds}</p>}
      </div>

      <div className="bg-muted/20 flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Published</Label>
            <p className="text-muted-foreground text-xs">Whether this comic is visible to the public.</p>
          </div>
          <Switch
            checked={formData.published}
            onCheckedChange={(checked) => handleSwitchChange('published', checked)}
          />
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Adult Content</Label>
            <p className="text-muted-foreground text-xs">Mark if this comic contains mature content.</p>
          </div>
          <Switch checked={formData.isAdult} onCheckedChange={(checked) => handleSwitchChange('isAdult', checked)} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Comic'}
      </Button>
    </form>
  );
}

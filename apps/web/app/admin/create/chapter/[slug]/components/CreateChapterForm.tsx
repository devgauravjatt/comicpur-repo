// oxlint-disable no-unused-vars
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createChapterAction } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

interface CreateChapterFormProps {
  comicId: number;
  comicTitle: string;
  comicSlug: string;
  LastChapterNumber: number;
}

export default function CreateChapterForm({
  comicId,
  comicTitle,
  comicSlug,
  LastChapterNumber,
}: CreateChapterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    chapterNumber: LastChapterNumber,
    images: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'chapterNumber' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Process images: split by newline and filter empty lines
    const imagesArray = formData.images
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (imagesArray.length === 0) {
      setErrors((prev) => ({ ...prev, images: 'At least one image URL is required.' }));
      setIsLoading(false);
      return;
    }

    try {
      const result = await createChapterAction({
        title: formData.title,
        chapterNumber: formData.chapterNumber,
        comicId,
        images: imagesArray,
      });

      if (!result) {
        toast.error('Something went wrong. Please try again.');
        return;
      }

      if (result.success) {
        toast.success(result.message || 'Chapter created successfully');
        router.push(`/admin/chapters/${comicSlug}`); // Redirect to manage chapters
        router.refresh();
      } else {
        if ('errors' in result && result.errors) {
          const newErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, message]) => {
            if (typeof message === 'object' && message !== null && !Array.isArray(message)) {
              // Handle nested object errors (e.g., images: { '0': 'Invalid URL' })
              newErrors[key] = Object.entries(message)
                .map(([, msg]) => msg)
                .filter((msg): msg is string => typeof msg === 'string')
                .join(', ');
            } else {
              newErrors[key] = Array.isArray(message) ? message[0] : (message as string);
            }
          });
          setErrors(newErrors);
          toast.error('Please fix the errors in the form.');
        } else if ('error' in result) {
          toast.error(result.error || 'Failed to create chapter');
        }
      }
    } catch (_error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">New Chapter</h2>
        <p className="text-muted-foreground text-sm">
          Adding to: <span className="text-foreground font-medium">{comicTitle}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Chapter Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. The Beginning"
          className={errors.title ? 'border-destructive' : ''}
          required
        />
        {errors.title && <p className="text-destructive text-sm font-medium">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="chapterNumber">Chapter Number</Label>
        <div className="relative">
          <Input
            id="chapterNumber"
            name="chapterNumber"
            type="number"
            value={formData.chapterNumber}
            onChange={handleChange}
            className={errors.chapterNumber ? 'border-destructive' : ''}
            required
          />
        </div>
        <p className="text-muted-foreground text-xs">Suggested based on the last chapter.</p>
        {errors.chapterNumber && <p className="text-destructive text-sm font-medium">{errors.chapterNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (One per line)</Label>
        <Textarea
          id="images"
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className={`min-h-60 ${errors.images ? 'border-destructive' : ''}`}
          required
        />
        <p className="text-muted-foreground text-xs">Paste all image URLs for this chapter, each on a new line.</p>
        {errors.images && <p className="text-destructive text-sm font-medium">{errors.images}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Creating...
            </>
          ) : (
            'Create Chapter'
          )}
        </Button>
      </div>
    </form>
  );
}

export interface ResMoives {
  success: boolean;
  data: Datum[];
}

export interface Datum {
  id: number;
  name: string;
  slug: string;
  isAdult: boolean;
  description: string;
  comics: Comic[];
}

export interface Comic {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  published: boolean;
  chaptersCount: number;
  languageCode: string;
  isAdult: boolean;
  categoryIds: number[];
  createdAt: string;
  updatedAt: string;
}

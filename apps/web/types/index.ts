interface chapter {
  id: number;
  chapterNumber: number;
  title: string;
}

interface premium {
  userId: number;
  id: number;
  payMode: string;
  amount: number;
  active: boolean;
  expiryDate: string;
}

export interface webDataType {
  chapter: chapter;
  premium: premium;
}

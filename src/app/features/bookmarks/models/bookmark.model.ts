import { Tag } from './tag.model';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  faviconUrl?: string;
  screenshotUrl?: string;
  folderId?: string;
  tags?: Tag[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastVisited?: Date;
}
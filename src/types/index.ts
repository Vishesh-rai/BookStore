/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'guest' | 'reader' | 'author';
export type Niche = 'Education' | 'Comic' | 'Novel' | 'Poetry';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  niche?: Niche;
  library: string[]; // Book IDs
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorNiche: Niche;
  description: string;
  category: Niche;
  coverImage: string;
  pdfUrl: string;
  likes: number;
  dislikes: number;
  downloadCount: number;
  createdAt: string;
}

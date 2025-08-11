import { z } from 'zod';

// Environment validation schema (removed JWT_SECRET)
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('5000'),
  DATABASE_URL: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});


const userProfileSchema = z.object({
  firstName: z.string().min(1, 'Ad gerekli'),
  lastName: z.string().min(1, 'Soyad gerekli'),
  phone: z.string().min(1, 'Telefon gerekli'),
  email: z.string().email('Geçerli email adresi gerekli'),
});

// Cover Letter Schema
export const createCoverLetterSchema = z.object({
  content: z.string().min(1, 'İçerik gerekli'),
  positionTitle: z.string().min(1, 'Pozisyon başlığı gerekli'),
  companyName: z.string().min(1, 'Şirket adı gerekli'),
  jobDescription: z.string().min(10, 'İş tanımı en az 10 karakter olmalı'),
  userProfile: userProfileSchema,
});

export const updateCoverLetterSchema = z.object({
  updatedContent: z.string().min(1, 'Güncellenmiş içerik gerekli'),
});
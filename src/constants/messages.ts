/**
 * Merkezi Mesaj Yönetim Sistemi
 * Tüm servis mesajları ve hata kodları burada merkezi olarak yönetilir
 */

export interface ServiceMessage {
  code: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

export const SERVICE_MESSAGES = {
  // General Messages
  GENERAL: {
    SUCCESS: {
      code: 'GEN_001',
      message: 'İşlem başarıyla tamamlandı',
      status: 'success' as const,
    },
    FAILED: {
      code: 'GEN_002',
      message: 'İşlem başarısız',
      status: 'error' as const,
    },
    NOT_FOUND: {
      code: 'GEN_003',
      message: 'Kaynak bulunamadı',
      status: 'error' as const,
    },
    UNAUTHORIZED: {
      code: 'GEN_004',
      message: 'Yetkisiz erişim',
      status: 'error' as const,
    },
    VALIDATION_ERROR: {
      code: 'GEN_005',
      message: 'Veri doğrulama hatası',
      status: 'error' as const,
    },
  },

  // Cover Letter Messages
  COVER_LETTER: {
    GENERATION_FAILED: {
      code: 'CL_001',
      message: 'Cover letter oluşturma başarısız',
      status: 'error' as const,
    },
    NOT_FOUND: {
      code: 'CL_002',
      message: 'Cover letter bulunamadı',
      status: 'error' as const,
    },
    DELETE_SUCCESS: {
      code: 'CL_003',
      message: 'Cover letter başarıyla silindi',
      status: 'success' as const,
    },
  },

  // Cover Letter Detailed Messages
  COVER_LETTER_DETAILED: {
    GET_ERROR: {
      code: 'CLD_001',
      message: 'Detaylı cover letter getirme hatası',
      status: 'error' as const,
    },
    UPDATE_ERROR: {
      code: 'CLD_002',
      message: 'Detaylı cover letter güncelleme hatası',
      status: 'error' as const,
    },
    LIST_ERROR: {
      code: 'CLD_003',
      message: 'Detaylı cover letter listesi hatası',
      status: 'error' as const,
    },
    DELETE_ERROR: {
      code: 'CLD_004',
      message: 'Detaylı cover letter silme hatası',
      status: 'error' as const,
    },
  },

  // AI Messages
  AI: {
    API_KEY_MISSING: {
      code: 'AI_001',
      message: 'AI API anahtarı eksik',
      status: 'error' as const,
    },
    API_KEY_INVALID: {
      code: 'AI_002',
      message: 'AI API anahtarı geçersiz',
      status: 'error' as const,
    },
    GENERATION_FAILED: {
      code: 'AI_003',
      message: 'AI içerik oluşturma başarısız',
      status: 'error' as const,
    },
    RATE_LIMIT_EXCEEDED: {
      code: 'AI_004',
      message: 'AI API rate limit aşıldı',
      status: 'error' as const,
    },
  },

  // User Messages
  USER: {
    NOT_FOUND: {
      code: 'USR_001',
      message: 'Kullanıcı bulunamadı',
      status: 'error' as const,
    },
  },

  // CV Messages
  CV: {
    NOT_FOUND: {
      code: 'CV_001',
      message: 'CV bulunamadı',
      status: 'error' as const,
    },
    ANALYSIS_DATA_MISSING: {
      code: 'CV_002',
      message: 'CV analiz verisi eksik',
      status: 'error' as const,
    },
  },

  // PDF Messages
  PDF: {
    GENERATION_ERROR: {
      code: 'PDF_001',
      message: 'PDF oluşturma hatası',
      status: 'error' as const,
    },
  },

  // Auth Messages
  AUTH: {
    TOKEN_VERIFICATION_FAILED: {
      code: 'AUTH_001',
      message: 'Token doğrulama başarısız',
      status: 'error' as const,
    },
  },

  // Auth Extension Messages
  AUTH_EXT: {
    INVALID_TOKEN_ATTEMPT: {
      code: 'AUTH_EXT_001',
      message: 'Geçersiz token girişimi',
      status: 'warning' as const,
    },
  },

  // Rate Limit Messages
  RATE_LIMIT: {
    GENERAL_EXCEEDED: {
      code: 'RL_001',
      message: 'Genel rate limit aşıldı',
      status: 'error' as const,
    },
    AUTH_EXCEEDED: {
      code: 'RL_002',
      message: 'Auth rate limit aşıldı',
      status: 'error' as const,
    },
    UPLOAD_EXCEEDED: {
      code: 'RL_003',
      message: 'Upload rate limit aşıldı',
      status: 'error' as const,
    },
    API_EXCEEDED: {
      code: 'RL_004',
      message: 'API rate limit aşıldı',
      status: 'error' as const,
    },
  },

  // Response Messages
  RESPONSE: {
    INVALID_DATA: {
      code: 'RESP_001',
      message: 'Geçersiz veri',
      status: 'error' as const,
    },
    COVER_LETTER_NOT_FOUND: {
      code: 'RESP_002',
      message: 'Cover letter bulunamadı',
      status: 'error' as const,
    },
    COVER_LETTER_UPDATE_SUCCESS: {
      code: 'RESP_003',
      message: 'Cover letter başarıyla güncellendi',
      status: 'success' as const,
    },
    COVER_LETTER_UPDATE_ERROR: {
      code: 'RESP_004',
      message: 'Cover letter güncelleme hatası',
      status: 'error' as const,
    },
    COVER_LETTER_INFO_ERROR: {
      code: 'RESP_005',
      message: 'Cover letter bilgileri alınamadı',
      status: 'error' as const,
    },
    COVER_LETTER_LIST_ERROR: {
      code: 'RESP_006',
      message: 'Cover letter listesi alınamadı',
      status: 'error' as const,
    },
    COVER_LETTER_NOT_READY: {
      code: 'RESP_007',
      message: 'Cover letter henüz hazır değil',
      status: 'error' as const,
    },
    PDF_GENERATION_ERROR: {
      code: 'RESP_008',
      message: 'PDF oluşturma hatası',
      status: 'error' as const,
    },
  },

  // Logger Messages
  LOGGER: {
    COVER_LETTER_GET_ERROR: {
      code: 'LOG_001',
      message: 'Cover letter getirme hatası loglandı',
      status: 'error' as const,
    },
    COVER_LETTER_UPDATE_ERROR: {
      code: 'LOG_002',
      message: 'Cover letter güncelleme hatası loglandı',
      status: 'error' as const,
    },
    COVER_LETTER_LIST_ERROR: {
      code: 'LOG_003',
      message: 'Cover letter listeleme hatası loglandı',
      status: 'error' as const,
    },
    PDF_DOWNLOAD_ERROR: {
      code: 'LOG_004',
      message: 'PDF indirme hatası loglandı',
      status: 'error' as const,
    },
  },

  // App Messages
  APP: {
    API_RUNNING: {
      code: 'APP_001',
      message: 'API başarıyla çalışıyor',
      status: 'success' as const,
    },
    HEALTH_CHECK_FAILED: {
      code: 'APP_002',
      message: 'Sağlık kontrolü başarısız',
      status: 'error' as const,
    },
    ENDPOINT_NOT_FOUND: {
      code: 'APP_003',
      message: 'Endpoint bulunamadı',
      status: 'error' as const,
    },
  },

  // Error Messages
  ERROR: {
    SERVER_ERROR: {
      code: 'ERR_001',
      message: 'Sunucu hatası',
      status: 'error' as const,
    },
  },
};

/**
 * Mesajı formatlar ve döndürür
 */
export function formatMessage(serviceMessage: ServiceMessage, ...args: any[]): string {
  let message = serviceMessage.message;
  
  // Placeholder'ları değiştir (%s, %d, vb.)
  args.forEach((arg, index) => {
    message = message.replace(`%${index + 1}`, arg);
    message = message.replace('%s', String(arg));
    message = message.replace('%d', String(arg));
  });

  return message;
}

/**
 * Hata mesajı oluşturur
 */
export function createErrorMessage(serviceMessage: ServiceMessage, error?: Error): string {
  let message = serviceMessage.message;
  
  if (error) {
    message += `: ${error.message}`;
  }

  return message;
}
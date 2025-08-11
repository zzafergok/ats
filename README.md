# ATS Cover Letter & CV Generator Service

Profesyonel kapak mektubu ve CV PDF oluşturma servisi. Stateless mimari ile çalışır - kullanıcı doğrulaması gerektirmez.

## Servisler

### 1. Cover Letter Service

Dışarıdan alınan içeriğe kullanıcı iletişim bilgilerini ekleyerek kapak mektubu oluşturur.

### 2. CV Generator Service

5 farklı profesyonel CV şablonu ile PDF CV oluşturmayı destekler.

## API Servisleri

### Cover Letter Service

#### POST `/api/cover-letter` - Cover Letter Oluştur

| Parametre               | Tip    | Zorunlu | Açıklama                        |
| ----------------------- | ------ | ------- | ------------------------------- |
| `content`               | string | ✅      | Dışarıdan alınan mektup içeriği |
| `positionTitle`         | string | ✅      | Başvurulacak pozisyon           |
| `companyName`           | string | ✅      | Şirket adı                      |
| `jobDescription`        | string | ✅      | İş tanımı (min. 10 karakter)    |
| `userProfile.firstName` | string | ✅      | Ad                              |
| `userProfile.lastName`  | string | ✅      | Soyad                           |
| `userProfile.phone`     | string | ✅      | Telefon                         |
| `userProfile.email`     | string | ✅      | Email adresi                    |

#### GET `/api/cover-letter/:id` - Cover Letter Getir

| Parametre | Tip           | Zorunlu | Açıklama           |
| --------- | ------------- | ------- | ------------------ |
| `id`      | string (path) | ✅      | Cover letter ID'si |

#### PUT `/api/cover-letter/:id` - Cover Letter Güncelle

| Parametre        | Tip           | Zorunlu | Açıklama            |
| ---------------- | ------------- | ------- | ------------------- |
| `id`             | string (path) | ✅      | Cover letter ID'si  |
| `updatedContent` | string        | ✅      | Güncellenmiş içerik |

#### DELETE `/api/cover-letter/:id` - Cover Letter Sil

| Parametre | Tip           | Zorunlu | Açıklama           |
| --------- | ------------- | ------- | ------------------ |
| `id`      | string (path) | ✅      | Cover letter ID'si |

#### GET `/api/cover-letter/:id/download` - PDF İndir

| Parametre | Tip           | Zorunlu | Açıklama           |
| --------- | ------------- | ------- | ------------------ |
| `id`      | string (path) | ✅      | Cover letter ID'si |

---

### CV Generator Service

#### POST `/api/cv-generator` - CV Oluştur

| Parametre      | Tip            | Zorunlu | Açıklama                                                                                                   |
| -------------- | -------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `templateType` | string         | ✅      | Template tipi (`basic-hr`, `office-manager`, `simple-classic`, `stylish-accounting`, `minimalist-turkish`) |
| `data`         | CVTemplateData | ✅      | CV verileri                                                                                                |
| `version`      | string         | ❌      | Versiyon (`global`, `turkey`)                                                                              |
| `language`     | string         | ❌      | Dil (`turkish`, `english`)                                                                                 |

#### CVTemplateData Object Yapısı

**personalInfo (Zorunlu)**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `firstName` | string | ✅ | Ad |
| `lastName` | string | ✅ | Soyad |
| `email` | string | ✅ | Email adresi |
| `phone` | string | ✅ | Telefon |
| `address` | string | ✅ | Adres |
| `city` | string | ✅ | Şehir |
| `jobTitle` | string | ❌ | İş unvanı |
| `linkedin` | string | ❌ | LinkedIn profili |
| `github` | string | ❌ | GitHub profili |
| `website` | string | ❌ | Web sitesi |
| `medium` | string | ❌ | Medium profili |

**objective (Zorunlu)**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `objective` | string | ✅ | Kariyer hedefi |

**experience (Zorunlu)**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `company` | string | ✅ | Şirket adı |
| `jobTitle` | string | ✅ | İş unvanı |
| `location` | string | ✅ | Lokasyon |
| `startDate` | string | ✅ | Başlangıç tarihi |
| `endDate` | string | ✅ | Bitiş tarihi |
| `isCurrent` | boolean | ✅ | Mevcut işse true |
| `description` | string | ✅ | İş tanımı |

**education (Zorunlu)**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `university` | string | ✅ | Üniversite adı |
| `degree` | string | ✅ | Derece |
| `field` | string | ✅ | Alan |
| `location` | string | ✅ | Lokasyon |
| `startDate` | string | ✅ | Başlangıç tarihi |
| `graduationDate` | string | ✅ | Mezuniyet tarihi |
| `details` | string | ❌ | Ek detaylar |

**İsteğe Bağlı Alanlar**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `skills` | string[] | ❌ | Genel yetenekler |
| `technicalSkills` | object | ❌ | Teknik yetenekler (frontend, backend, database, tools) |
| `projects` | object[] | ❌ | Projeler (name, description, technologies, link) |
| `certificates` | object[] | ❌ | Sertifikalar (name, issuer, date) |
| `languages` | object[] | ❌ | Diller (language, level) |
| `references` | object[] | ❌ | Referanslar (name, company, contact) |
| `communication` | string | ❌ | İletişim becerileri |
| `leadership` | string | ❌ | Liderlik becerileri |

#### GET `/api/cv-generator/:id` - CV Detayları

| Parametre | Tip           | Zorunlu | Açıklama |
| --------- | ------------- | ------- | -------- |
| `id`      | string (path) | ✅      | CV ID'si |

#### GET `/api/cv-generator/:id/download` - CV PDF İndir

| Parametre | Tip           | Zorunlu | Açıklama |
| --------- | ------------- | ------- | -------- |
| `id`      | string (path) | ✅      | CV ID'si |

#### PUT `/api/cv-generator/:id/regenerate` - CV Yeniden Oluştur

| Parametre | Tip            | Zorunlu | Açıklama         |
| --------- | -------------- | ------- | ---------------- |
| `id`      | string (path)  | ✅      | CV ID'si         |
| `data`    | CVTemplateData | ✅      | Yeni CV verileri |

#### DELETE `/api/cv-generator/:id` - CV Sil

| Parametre | Tip           | Zorunlu | Açıklama |
| --------- | ------------- | ------- | -------- |
| `id`      | string (path) | ✅      | CV ID'si |

---

## CV Template Tipleri

| Template             | Açıklama                               |
| -------------------- | -------------------------------------- |
| `basic-hr`           | İnsan kaynakları odaklı layout         |
| `office-manager`     | Yöneticilik pozisyonları için tasarım  |
| `simple-classic`     | Temiz geleneksel format                |
| `stylish-accounting` | Finans sektörü için şık tasarım        |
| `minimalist-turkish` | Türkçe dil desteği ile minimal tasarım |

## Kurulum

### Gereksinimler

- Node.js >= 18.0.0
- PostgreSQL veritabanı

### Adımlar

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Environment değişkenlerini ayarlayın:

```bash
# .env dosyasını oluşturun
DATABASE_URL="postgresql://..."
NODE_ENV="development"
PORT="5000"
```

3. Veritabanını hazırlayın:

```bash
npm run prisma:push
npm run prisma:generate
```

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Build
npm run build

# Prodüksiyon sunucusu
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Veritabanı işlemleri
npm run prisma:studio
npm run prisma:push
npm run prisma:generate
```

## Teknoloji Yığını

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Zod

## Mimari

Stateless katmanlı mimari:

- **Controllers**: HTTP istekleri ve yanıtları
- **Services**: İş mantığı ve PDF üretimi
- **Middleware**: Güvenlik, rate limiting, error handling
- **Database**: Prisma ORM ile PostgreSQL
- **Types**: TypeScript interfaces

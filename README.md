# Home App Web

Home App’in web deneyimi: insanların fiziksel ev ve yaşam mağazalarını gerçek ziyaretler, fotoğraflar ve topluluk yorumları üzerinden keşfetmesini sağlayan anonymous-first bir Next.js uygulaması.

Bu repository şu anda ürünün çalışan frontend prototipini, responsive tasarım sistemini ve browser-side API sınırını içerir.

## Mevcut deneyim

- Fotoğraf ve kullanıcı deneyimi odaklı ana akış
- Doğal dil sorguları için keşif/arama deneyimi
- Home App topluluk verisi ile Google verisini ayrı gösteren sonuçlar
- Server-rendered mağaza, yorum ve kullanıcı sayfaları
- Favoriler, profil ve yorum oluşturma akışlarının temel ekranları
- Google ve passwordless e-posta OTP için bağlamsal giriş diyaloğu
- Türkçe, İngilizce, Almanca ve Rusça arayüz sözlükleri
- Mobil web’de ekranın altında yüzen, label-free ve erişilebilir cam navigasyon
- Klavye odağı, semantic HTML ve reduced-motion desteği

## Tasarım yaklaşımı

Home App bir e-ticaret veya mağaza paneli değil; fiziksel mağaza keşfine odaklanan bir consumer social üründür.

Arayüz sıcak, sakin ve editoryaldir. Fotoğraf ile kullanıcı içeriği arayüz kromundan daha baskındır. Ana renkler kırık beyaz yüzeyler, koyu mürekkep tonları ve terracotta vurgudan oluşur.

Responsive web bilinçli olarak iki ayrı kompozisyon kullanır:

- Geniş ekranlarda editorial içerik kolonları ve gerektiğinde yardımcı yan panel
- 900 px ve altında, viewport tabanına sabitlenen gerçek `backdrop-filter` cam navigasyon
- Mobil navigasyonda görünür metin yerine tanınabilir Lucide ikonları; erişilebilir adlar korunur
- Cam efekti yalnızca navigasyon materyalinde kullanılır

Paylaşılan tasarım otoritesi backend repository’sindeki `.agents/skills/home-app-design/SKILL.md` dosyasıdır.

## Teknoloji

- Next.js 16 App Router
- React 19
- TypeScript
- Lucide React
- Next.js route handlers üzerinden browser BFF
- Source Sans 3 ve Source Serif 4

## Rotalar

| Rota | Amaç |
| --- | --- |
| `/` | Topluluk ana akışı |
| `/discover` | Doğal dil araması ve hibrit sonuçlar |
| `/stores/[id]` | Server-rendered mağaza detayı |
| `/reviews/[id]` | Herkese açık yorum detayı |
| `/users/[id]` | Herkese açık kullanıcı profili |
| `/favorites` | Favoriler temeli |
| `/create` | Ziyaret yorumu oluşturma temeli |
| `/profile` | Kişisel profil ve dil ayarları |

## Kurulum

Gereksinimler:

- Node.js 20 veya güncel LTS
- Çalışan bir Home App API instance’ı

```bash
cp .env.example .env.local
npm install
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde açılır.

### Ortam değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `API_ORIGIN` | Next.js sunucusunun erişeceği Home App API origin’i |
| `BFF_SECRET` | Yalnızca server tarafında kullanılan backend client secret |
| `NEXT_PUBLIC_SITE_URL` | Metadata ve canonical URL tabanı |

`BFF_SECRET` değişkenini hiçbir zaman `NEXT_PUBLIC_` ile yayınlamayın. Browser, backend ile doğrudan değil `/api/proxy/*` üzerinden konuşur.

## API ve kimlik doğrulama

Typed domain şekilleri `home-app-api/docs/openapi.yaml` ile uyumludur. BFF katmanı locale, visitor session, bearer state, arama attribution header’ları, `Retry-After` ve request ID’lerini taşır.

Access ve rotating refresh token’ları HTTP-only cookie’lerde tutulur. Arayüz anonim gezinmeyi engellemez; favorileme, beğenme, takip, yorum ve ziyaret paylaşma gibi korumalı aksiyonlarda bağlamsal auth açılır.

## Fixture ve prototip davranışları

Backend erişilebilir olmadığında canonical fixture verileri kullanılır. Geliştirme fotoğrafları API DTO’larına eklenmez; presentation adapter’da ayrı tutulur.

Bazı etkileşimler henüz prototip seviyesindedir. Örneğin beğeni/favori sayacı yerel state ile değişebilir ve gerçek API başarısını temsil etmez. Production entegrasyonunda UI yalnızca başarılı mutation sonrasında commit edilmeli veya optimistic update hata halinde geri alınmalıdır.

## Proje yapısı

```text
src/
  app/          App Router sayfaları ve API route handler’ları
  components/   Feed, auth, arama ve mağaza bileşenleri
  i18n/         tr, en, de ve ru sözlükleri
  lib/          Typed API, fixture ve server yardımcıları
public/
  images/       Geliştirme sunum görselleri
```

## Doğrulama

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## İlgili repository’ler

- API: [buraltintas/home-app-api](https://github.com/buraltintas/home-app-api)
- Mobile: [buraltintas/home-app-mobile](https://github.com/buraltintas/home-app-mobile)


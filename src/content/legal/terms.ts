import {legalFacts} from '@/lib/legal-facts';
import type {LegalDoc} from './types';

const controller=legalFacts.legalEntityName??'';
const mail=legalFacts.legalEmail??'';
const age=legalFacts.minimumAge??16;

// Two drafting rules govern this document.
//
// First, no "we are never liable for anything" clause. Turkish law does not enforce a
// blanket exclusion, and a clause a court strikes out protects nobody. Liability is
// limited as far as the law permits and the carve-outs -- intent, gross negligence,
// mandatory consumer rights -- are stated openly, which is what makes the rest hold.
//
// Second, every disclaimer describes the product as it is. The platform sells nothing,
// verifies no store ownership, carries no advertising, and does not yet operate a
// moderation system beyond acting on reports sent by email. Claiming otherwise to sound
// more established would create the liability it was meant to avoid.
//
// The partnership wording says that listing does not imply a partnership, rather than
// that no store is a partner. Commercial arrangements are planned, and a clause that
// becomes false the day the first one is signed is worse than no clause.
export const terms:LegalDoc={
  slug:'terms',
  version:'1.0',
  effective:'2026-08-19',
  updated:'2026-08-19',
  requiresEntity:true,
  content:{
    tr:{
      title:'Kullanım Koşulları',
      summary:`Boşa Gezme!'yi kullanarak bu koşulları kabul etmiş olursunuz. Kısaca: burası mağaza keşfetmeye yarayan bir topluluk platformudur, ürün satmaz, listelenmek iş ortaklığı anlamına gelmez ve yazdığınız içerikten siz sorumlusunuz.`,
      sections:[
        {id:'taraflar',heading:'1. Taraflar ve tanımlar',blocks:[
          {p:`Bu koşullar, platformu işleten ${controller} ("Boşa Gezme!", "biz") ile platformu kullanan kişi ("siz") arasındadır. İletişim: ${mail}`},
          {p:'"Platform" bosagezme.com üzerinden sunulan hizmeti, "içerik" sizin yazdığınız değerlendirme, yorum ve yüklediğiniz görselleri ifade eder.'},
        ]},
        {id:'hizmet',heading:'2. Hizmetin kapsamı ve ne olmadığı',blocks:[
          {p:'Boşa Gezme!, fiziksel ev ve yaşam mağazalarını keşfetmeye yarayan bir bilgi ve topluluk platformudur.'},
          {p:'Boşa Gezme! satıcı, mağaza sahibi, tüccar veya herhangi bir mağazanın temsilcisi ya da acentesi değildir. Platform üzerinden satış, sipariş, rezervasyon veya ödeme yapılamaz.'},
          {p:'Bir mağazanın platformda yer alması, tek başına, o mağazayla aramızda ticari ilişki veya ortaklık bulunduğu anlamına gelmez. Şu anda ücretli yerleşim, sponsorluk veya reklam uygulaması yoktur; ileride ticari iş birlikleri kurulursa açıkça belirtilir.'},
        ]},
        {id:'yas',heading:'3. Yaş ve hesap',blocks:[
          {p:`Hesap oluşturabilmek için en az ${age} yaşında olmanız gerekir. ${age} yaşından küçükseniz hesap açamazsınız.`},
          {p:'Hesabınızın güvenliğinden siz sorumlusunuz. Giriş e-postanıza erişimi koruyun; hesabınızın izinsiz kullanıldığını fark ederseniz bize bildirin.'},
          {p:'Hesap açmadan da platformu gezebilir, mağazaları ve değerlendirmeleri okuyabilirsiniz. Değerlendirme yazmak, favorilemek, beğenmek ve takip etmek için giriş gerekir.'},
        ]},
        {id:'kullanim',heading:'4. Kabul edilebilir kullanım',blocks:[
          {p:'Platformu hukuka uygun şekilde kullanmayı kabul edersiniz. Aşağıdakiler yasaktır:'},
          {ul:[
            'Gitmediğiniz bir mağaza hakkında ziyaret etmiş gibi değerlendirme yazmak',
            'Sahte, yanıltıcı veya karşılığında menfaat sağlanmış değerlendirme yazmak',
            'Bir mağazanın puanını yapay olarak yükseltmek veya düşürmek amacıyla toplu/koordineli hareket etmek',
            'Kendi işletmeniz veya rakibiniz hakkında bunu belirtmeden değerlendirme yazmak',
            'Başkasının kimliğine bürünmek',
            'Hakaret, taciz, tehdit, nefret söylemi veya ayrımcılık içeren içerik paylaşmak',
            'Cinsel içerik veya hukuka aykırı içerik paylaşmak',
            'Başkasının kişisel bilgilerini rızası olmadan paylaşmak',
            'Reklam, spam veya alakasız ticari içerik paylaşmak',
            'Hakkı size ait olmayan görselleri yüklemek',
            'Platformun teknik işleyişini bozmaya veya güvenlik önlemlerini aşmaya çalışmak',
          ]},
        ]},
        {id:'icerik',heading:'5. İçeriğiniz ve verdiğiniz kullanım izni',blocks:[
          {p:'Yazdığınız içerik size aittir. Mülkiyeti bizde değildir.'},
          {p:'İçeriğinizi platformda yayımlayabilmemiz için bize sınırlı bir kullanım izni vermiş olursunuz: içeriğinizi platform üzerinde ve platformun tanıtımında göstermek, çoğaltmak, biçimlendirmek ve farklı ekran boyutlarına uyarlamak. Bu izin dünya çapında ve bedelsizdir, ancak yalnızca platformun işletilmesi ve tanıtımı amacıyla sınırlıdır.'},
          {p:'İçeriğinizi sildiğinizde veya hesabınızı kapattığınızda bu izin sona erer. Teknik yedeklerde geçici olarak kalabilecek kopyalar ile başkalarının o içeriğe verdiği yanıtların bağlamı bunun dışındadır.'},
          {p:'Yüklediğiniz görseller üzerinde gerekli haklara sahip olduğunuzu ve üçüncü kişilerin haklarını ihlal etmediğinizi beyan edersiniz.'},
        ]},
        {id:'moderasyon',heading:'6. İçerik denetimi ve şikayet',blocks:[
          {p:`Kurallara aykırı olduğunu düşündüğünüz içeriği ${mail} adresine bildirebilirsiniz. Bildirimleri değerlendirir ve gerekli gördüğümüz içeriği kaldırabilir veya hesaba kısıtlama uygulayabiliriz.`},
          {note:'Şu anda otomatik içerik denetim sistemi ve resmî bir itiraz süreci bulunmamaktadır. Bildirimler elle değerlendirilmektedir. Bu durum değiştiğinde bu metin güncellenecektir.'},
          {p:'İçerik denetimi yapıyor olmamız, hukuka aykırı veya yanlış her içeriğin her zaman tespit edileceği anlamına gelmez. Kaldırılmamış olması onaylandığı anlamına gelmez.'},
        ]},
        {id:'ucuncu-taraf',heading:'7. Mağaza bilgileri ve üçüncü taraf kaynaklar',blocks:[
          {p:'Mağaza adları, adresleri ve konumları büyük ölçüde Google Places gibi üçüncü taraf kaynaklardan gelir. Bu bilgiler eskimiş, eksik veya yanlış olabilir.'},
          {p:'Çalışma saatleri, fiyatlar, stok durumu, ürün çeşitliliği, mağazanın açık olup olmadığı ve adres doğruluğu konusunda garanti veremeyiz. Bir yere gitmeden önce bu bilgileri bağımsız olarak doğrulamanızı öneririz.'},
          {p:'Değerlendirmeler yazanların kişisel görüşleridir. Boşa Gezme! bu görüşleri benimsemez ve doğruluklarını garanti etmez.'},
          {p:'Sıralama ve öneriler, keşfe yardımcı olmayı amaçlayan bilgilendirici araçlardır; bir tavsiye veya kalite garantisi değildir.'},
        ]},
        {id:'konum',heading:'8. Konum özellikleri ve güvenlik',blocks:[
          {p:'Arama ve ziyaret doğrulama konum bilgisi kullanır. Konum bilgisi cihazınızdan gelir ve her zaman doğru değildir.'},
          {p:'Bir mağazaya giderken yol ve çevre güvenliğinden siz sorumlusunuz. Platform, gideceğiniz yerin veya yolun güvenli olduğuna dair bir değerlendirme yapmaz.'},
        ]},
        {id:'yapay-zeka',heading:'9. Yapay zekâ destekli arama',blocks:[
          {p:'Aramanızın ne aradığını anlamak için yapay zekâ destekli bir işleme kullanılır. Bu işleme hatalı sonuç verebilir; sonuçların eksiksiz veya kusursuz olacağı garanti edilmez.'},
        ]},
        {id:'erisim',heading:'10. Hizmetin sürekliliği ve değişiklikler',blocks:[
          {p:'Hizmetin kesintisiz sunulacağı garanti edilmez. Bakım, teknik arıza veya bizim kontrolümüz dışındaki sebeplerle (mücbir sebep dahil) hizmet geçici olarak kullanılamayabilir.'},
          {p:'Platformun özelliklerini değiştirebilir, ekleyebilir veya kaldırabiliriz.'},
        ]},
        {id:'askiya-alma',heading:'11. Askıya alma ve sona erdirme',blocks:[
          {p:'Bu koşulları veya topluluk kurallarını ihlal eden hesapları kısıtlayabilir, askıya alabilir veya kapatabiliriz. Ölçülü davranır, mümkün olduğunda sebebini bildiririz.'},
          {p:'Hesabınızı istediğiniz zaman profil sayfanızdan kendiniz silebilirsiniz. Silme işleminin sonuçları hesap silme sayfasında ayrıntılı olarak açıklanmıştır.'},
        ]},
        {id:'fikri',heading:'12. Fikri mülkiyet',blocks:[
          {p:'Boşa Gezme! adı, logosu, arayüz tasarımı ve yazılımı üzerindeki haklar bize aittir. Kullanıcı içeriği bu kapsamda değildir.'},
          {p:'Platformda görünen üçüncü taraf marka ve işletme adları ilgili sahiplerine aittir; kullanılmaları bir ilişki veya onay anlamına gelmez.'},
          {p:`Telif veya marka hakkınızın ihlal edildiğini düşünüyorsanız ${mail} adresine bildirin.`},
        ]},
        {id:'sorumluluk',heading:'13. Sorumluluğun sınırı',blocks:[
          {p:'Boşa Gezme! bir bilgi ve keşif platformudur. Bir mağazadan aldığınız ürün veya hizmetten, mağazanın davranışından, fiyatından veya stok durumundan sorumlu değiliz; bu ilişki sizinle mağaza arasındadır.'},
          {p:'Sorumluluğumuz, yürürlükteki hukukun izin verdiği ölçüde sınırlıdır.'},
          {p:'Bu sınırlama; kastımızdan, ağır ihmalimizden, kişilik haklarına verilen zararlardan ve mevzuat uyarınca sınırlandırılması mümkün olmayan sorumluluklardan doğan hâlleri kapsamaz.'},
          {p:'Tüketici mevzuatından doğan ve sözleşmeyle ortadan kaldırılamayan haklarınız saklıdır. Bu metindeki hiçbir hüküm o hakları sınırlandıracak şekilde yorumlanamaz.'},
        ]},
        {id:'degisiklik',heading:'14. Koşullardaki değişiklikler',blocks:[
          {p:'Bu koşulları güncelleyebiliriz. Güncel sürüm ve yürürlük tarihi bu sayfanın başında gösterilir. Önemli değişiklikleri platform üzerinden bildiririz.'},
        ]},
        {id:'hukuk',heading:'15. Uygulanacak hukuk ve yetkili mahkeme',blocks:[
          {p:'Bu koşullara Türk hukuku uygulanır.'},
          {p:'Uyuşmazlıklarda Türkiye mahkemeleri ve icra daireleri yetkilidir. Tüketici sıfatıyla hareket ediyorsanız, tüketici hakem heyetlerine ve kendi yerleşim yerinizdeki tüketici mahkemesine başvurma hakkınız saklıdır; bu metin o hakkı sınırlandırmaz.'},
        ]},
        {id:'diger',heading:'16. Diğer hükümler',blocks:[
          {p:'Bu koşulların bir hükmünün geçersiz sayılması diğer hükümleri etkilemez.'},
          {p:'Bir hakkımızı kullanmamamız o haktan vazgeçtiğimiz anlamına gelmez.'},
          {p:'Platformda kullanılan Google Places, Google hesabı ve benzeri üçüncü taraf hizmetlerin kendi kullanım koşulları geçerlidir.'},
        ]},
      ],
    },
    en:{
      title:'Terms of Service',
      summary:'By using Boşa Gezme! you accept these terms. In short: this is a community platform for discovering stores, it sells nothing, being listed does not mean a partnership, and you are responsible for the content you write.',
      sections:[
        {id:'taraflar',heading:'1. Parties and definitions',blocks:[
          {p:`These terms are between ${controller}, who operates the platform ("Boşa Gezme!", "we"), and the person using it ("you"). Contact: ${mail}`},
          {p:'"Platform" means the service provided at bosagezme.com. "Content" means the reviews and comments you write and the images you upload.'},
        ]},
        {id:'hizmet',heading:'2. What the service is, and what it is not',blocks:[
          {p:'Boşa Gezme! is an information and community platform for discovering physical home and living stores.'},
          {p:'Boşa Gezme! is not a seller, store owner, merchant, agent or representative of any store. No sale, order, reservation or payment can be made through the platform.'},
          {p:'A store appearing on the platform does not, by itself, mean there is a commercial relationship or partnership with it. There is currently no paid placement, sponsorship or advertising; if commercial arrangements are introduced, they will be clearly marked.'},
        ]},
        {id:'yas',heading:'3. Age and account',blocks:[
          {p:`You must be at least ${age} years old to create an account. If you are under ${age}, you may not open one.`},
          {p:'You are responsible for the security of your account. Protect access to your sign-in email address, and tell us if you notice unauthorised use.'},
          {p:'You can browse the platform and read stores and reviews without an account. Writing reviews, saving favourites, liking and following require signing in.'},
        ]},
        {id:'kullanim',heading:'4. Acceptable use',blocks:[
          {p:'You agree to use the platform lawfully. The following are prohibited:'},
          {ul:[
            'Writing a review of a store as though you visited it when you did not',
            'Writing fake or misleading reviews, or reviews given in exchange for a benefit',
            'Acting in a coordinated way to raise or lower a store’s rating artificially',
            'Reviewing your own business or a competitor without disclosing it',
            'Impersonating another person',
            'Posting insulting, harassing, threatening, hateful or discriminatory content',
            'Posting sexual content or unlawful content',
            'Sharing another person’s personal information without their consent',
            'Posting advertising, spam or unrelated commercial content',
            'Uploading images you do not hold the rights to',
            'Attempting to disrupt the platform or circumvent its security measures',
          ]},
        ]},
        {id:'icerik',heading:'5. Your content and the licence you grant',blocks:[
          {p:'The content you write is yours. We do not own it.'},
          {p:'So that we can publish it on the platform, you grant us a limited licence: to display, reproduce, format and adapt your content for different screen sizes, on the platform and in promoting the platform. This licence is worldwide and royalty-free, but limited to operating and promoting the platform.'},
          {p:'The licence ends when you delete your content or close your account, except for copies that may temporarily remain in technical backups and the context of replies others made to it.'},
          {p:'You confirm that you hold the necessary rights to the images you upload and that they do not infringe the rights of others.'},
        ]},
        {id:'moderasyon',heading:'6. Content moderation and reporting',blocks:[
          {p:`You can report content you believe breaks the rules to ${mail}. We review reports and may remove content or restrict an account where we consider it necessary.`},
          {note:'There is currently no automated moderation system and no formal appeals process. Reports are reviewed by hand. This text will be updated when that changes.'},
          {p:'That we moderate does not mean every unlawful or inaccurate piece of content will always be detected. Content that has not been removed has not thereby been approved.'},
        ]},
        {id:'ucuncu-taraf',heading:'7. Store information and third-party sources',blocks:[
          {p:'Store names, addresses and locations largely come from third-party sources such as Google Places. That information may be out of date, incomplete or wrong.'},
          {p:'We cannot guarantee opening hours, prices, stock, product range, whether a store is open, or the accuracy of an address. We recommend confirming these independently before travelling.'},
          {p:'Reviews are the personal opinions of the people who wrote them. Boşa Gezme! does not adopt those opinions and does not guarantee their accuracy.'},
          {p:'Rankings and recommendations are informational aids to discovery, not advice or a guarantee of quality.'},
        ]},
        {id:'konum',heading:'8. Location features and safety',blocks:[
          {p:'Search and visit verification use location. Location comes from your device and is not always accurate.'},
          {p:'You are responsible for your own safety when travelling to a store. The platform makes no assessment of whether a destination or route is safe.'},
        ]},
        {id:'yapay-zeka',heading:'9. AI-assisted search',blocks:[
          {p:'AI-assisted processing is used to interpret what your search means. It can produce incorrect results, and results are not guaranteed to be complete or accurate.'},
        ]},
        {id:'erisim',heading:'10. Availability and changes',blocks:[
          {p:'Uninterrupted service is not guaranteed. The service may be temporarily unavailable due to maintenance, technical failure, or causes outside our control including force majeure.'},
          {p:'We may change, add or remove features of the platform.'},
        ]},
        {id:'askiya-alma',heading:'11. Suspension and termination',blocks:[
          {p:'We may restrict, suspend or close accounts that breach these terms or the community rules. We act proportionately and tell you the reason where we can.'},
          {p:'You can delete your account yourself at any time from your profile page. What deletion does is set out in detail on the account deletion page.'},
        ]},
        {id:'fikri',heading:'12. Intellectual property',blocks:[
          {p:'The Boşa Gezme! name, logo, interface design and software are ours. User content is not covered by this.'},
          {p:'Third-party trade marks and business names shown on the platform belong to their owners; their appearance does not imply a relationship or endorsement.'},
          {p:`If you believe your copyright or trade mark has been infringed, report it to ${mail}.`},
        ]},
        {id:'sorumluluk',heading:'13. Limitation of liability',blocks:[
          {p:'Boşa Gezme! is an information and discovery platform. We are not responsible for the goods or services you obtain from a store, for a store’s conduct, its prices or its stock; that relationship is between you and the store.'},
          {p:'Our liability is limited to the extent permitted by applicable law.'},
          {p:'This limitation does not cover our intent or gross negligence, harm to personal rights, or any liability that cannot lawfully be limited.'},
          {p:'Your rights under consumer legislation that cannot be excluded by contract are reserved. Nothing in this document may be read as limiting them.'},
        ]},
        {id:'degisiklik',heading:'14. Changes to these terms',blocks:[
          {p:'We may update these terms. The current version and effective date appear at the top of this page. We will announce significant changes on the platform.'},
        ]},
        {id:'hukuk',heading:'15. Governing law and competent courts',blocks:[
          {p:'Turkish law applies to these terms.'},
          {p:'The courts and enforcement offices of Türkiye have jurisdiction. If you are acting as a consumer, your right to apply to consumer arbitration committees and to the consumer court where you live is reserved, and this document does not restrict it.'},
        ]},
        {id:'diger',heading:'16. Other provisions',blocks:[
          {p:'If a provision of these terms is held invalid, the remaining provisions are unaffected.'},
          {p:'Not exercising a right does not mean we waive it.'},
          {p:'Third-party services used on the platform, such as Google Places and Google sign-in, are subject to their own terms.'},
        ]},
      ],
    },
    de:{
      title:'Nutzungsbedingungen',
      summary:'Mit der Nutzung von Boşa Gezme! akzeptierst du diese Bedingungen. Kurz gesagt: Dies ist eine Community-Plattform zum Entdecken von Geschäften, sie verkauft nichts, eine Listung bedeutet keine Partnerschaft, und für deine Inhalte bist du verantwortlich.',
      sections:[
        {id:'taraflar',heading:'1. Parteien und Begriffe',blocks:[
          {p:`Diese Bedingungen gelten zwischen ${controller}, der die Plattform betreibt („Boşa Gezme!“, „wir“), und der nutzenden Person („du“). Kontakt: ${mail}`},
          {p:'„Plattform“ ist der unter bosagezme.com bereitgestellte Dienst. „Inhalte“ sind deine Bewertungen, Kommentare und hochgeladenen Bilder.'},
        ]},
        {id:'hizmet',heading:'2. Was der Dienst ist und was nicht',blocks:[
          {p:'Boşa Gezme! ist eine Informations- und Community-Plattform zum Entdecken physischer Wohn- und Einrichtungsgeschäfte.'},
          {p:'Boşa Gezme! ist weder Verkäufer noch Geschäftsinhaber, Händler, Vertreter oder Vermittler eines Geschäfts. Über die Plattform sind kein Verkauf, keine Bestellung, keine Reservierung und keine Zahlung möglich.'},
          {p:'Das Erscheinen eines Geschäfts bedeutet für sich genommen keine geschäftliche Beziehung oder Partnerschaft. Derzeit gibt es keine bezahlte Platzierung, kein Sponsoring und keine Werbung; künftige kommerzielle Kooperationen werden deutlich gekennzeichnet.'},
        ]},
        {id:'yas',heading:'3. Alter und Konto',blocks:[
          {p:`Für ein Konto musst du mindestens ${age} Jahre alt sein. Unter ${age} Jahren darfst du kein Konto anlegen.`},
          {p:'Für die Sicherheit deines Kontos bist du verantwortlich. Schütze den Zugang zu deiner Anmelde-E-Mail und melde uns unbefugte Nutzung.'},
          {p:'Ohne Konto kannst du die Plattform durchsuchen sowie Geschäfte und Bewertungen lesen. Bewerten, Favorisieren, Liken und Folgen erfordern eine Anmeldung.'},
        ]},
        {id:'kullanim',heading:'4. Zulässige Nutzung',blocks:[
          {p:'Du verpflichtest dich zur rechtmäßigen Nutzung. Untersagt ist insbesondere:'},
          {ul:[
            'Ein Geschäft zu bewerten, als hättest du es besucht, obwohl das nicht zutrifft',
            'Gefälschte, irreführende oder gegen einen Vorteil verfasste Bewertungen',
            'Koordiniertes Vorgehen, um eine Bewertung künstlich anzuheben oder zu senken',
            'Das eigene Unternehmen oder einen Wettbewerber ohne Offenlegung zu bewerten',
            'Sich als eine andere Person auszugeben',
            'Beleidigende, belästigende, bedrohende, hasserfüllte oder diskriminierende Inhalte',
            'Sexuelle oder rechtswidrige Inhalte',
            'Personenbezogene Daten Dritter ohne deren Einwilligung zu teilen',
            'Werbung, Spam oder themenfremde kommerzielle Inhalte',
            'Bilder hochzuladen, an denen du keine Rechte hast',
            'Den Betrieb der Plattform zu stören oder Sicherheitsmaßnahmen zu umgehen',
          ]},
        ]},
        {id:'icerik',heading:'5. Deine Inhalte und die eingeräumte Lizenz',blocks:[
          {p:'Deine Inhalte gehören dir. Wir erwerben kein Eigentum daran.'},
          {p:'Damit wir sie veröffentlichen können, räumst du uns eine begrenzte Lizenz ein: deine Inhalte auf der Plattform und in deren Bewerbung anzuzeigen, zu vervielfältigen, zu formatieren und an Bildschirmgrößen anzupassen. Die Lizenz ist weltweit und unentgeltlich, aber auf Betrieb und Bewerbung der Plattform beschränkt.'},
          {p:'Die Lizenz endet, wenn du deine Inhalte löschst oder dein Konto schließt; ausgenommen sind Kopien in technischen Sicherungen und der Kontext von Antworten anderer.'},
          {p:'Du versicherst, die erforderlichen Rechte an hochgeladenen Bildern zu haben und keine Rechte Dritter zu verletzen.'},
        ]},
        {id:'moderasyon',heading:'6. Moderation und Meldungen',blocks:[
          {p:`Regelwidrige Inhalte kannst du an ${mail} melden. Wir prüfen Meldungen und können Inhalte entfernen oder Konten einschränken, wenn wir es für erforderlich halten.`},
          {note:'Derzeit gibt es weder ein automatisiertes Moderationssystem noch ein förmliches Beschwerdeverfahren. Meldungen werden manuell geprüft. Dieser Text wird angepasst, sobald sich das ändert.'},
          {p:'Dass wir moderieren, bedeutet nicht, dass jeder rechtswidrige oder unrichtige Inhalt stets erkannt wird. Nicht entfernte Inhalte sind damit nicht gebilligt.'},
        ]},
        {id:'ucuncu-taraf',heading:'7. Geschäftsdaten und Drittquellen',blocks:[
          {p:'Namen, Adressen und Standorte stammen überwiegend aus Drittquellen wie Google Places und können veraltet, unvollständig oder falsch sein.'},
          {p:'Öffnungszeiten, Preise, Bestand, Sortiment, Geöffnetsein und Adressgenauigkeit können wir nicht garantieren. Wir empfehlen, dies vor der Fahrt eigenständig zu prüfen.'},
          {p:'Bewertungen sind persönliche Meinungen ihrer Verfassenden. Boşa Gezme! macht sie sich nicht zu eigen und garantiert ihre Richtigkeit nicht.'},
          {p:'Ranglisten und Empfehlungen sind informative Hilfen zum Entdecken, keine Beratung und keine Qualitätsgarantie.'},
        ]},
        {id:'konum',heading:'8. Standortfunktionen und Sicherheit',blocks:[
          {p:'Suche und Besuchsbestätigung nutzen den Standort. Er stammt von deinem Gerät und ist nicht immer korrekt.'},
          {p:'Für deine Sicherheit auf dem Weg zu einem Geschäft bist du selbst verantwortlich. Die Plattform bewertet nicht, ob Ziel oder Weg sicher sind.'},
        ]},
        {id:'yapay-zeka',heading:'9. KI-gestützte Suche',blocks:[
          {p:'Zur Auswertung deiner Suchanfrage wird eine KI-gestützte Verarbeitung eingesetzt. Sie kann fehlerhafte Ergebnisse liefern; Vollständigkeit und Richtigkeit sind nicht garantiert.'},
        ]},
        {id:'erisim',heading:'10. Verfügbarkeit und Änderungen',blocks:[
          {p:'Ein unterbrechungsfreier Betrieb wird nicht zugesichert. Der Dienst kann durch Wartung, technische Störungen oder Umstände außerhalb unseres Einflusses, einschließlich höherer Gewalt, zeitweise nicht verfügbar sein.'},
          {p:'Wir können Funktionen ändern, ergänzen oder entfernen.'},
        ]},
        {id:'askiya-alma',heading:'11. Sperrung und Beendigung',blocks:[
          {p:'Konten, die gegen diese Bedingungen oder die Community-Regeln verstoßen, können wir einschränken, sperren oder schließen. Wir handeln verhältnismäßig und nennen den Grund, soweit möglich.'},
          {p:'Du kannst dein Konto jederzeit selbst über deine Profilseite löschen. Die Folgen sind auf der Seite zur Kontolöschung beschrieben.'},
        ]},
        {id:'fikri',heading:'12. Geistiges Eigentum',blocks:[
          {p:'Name, Logo, Oberflächengestaltung und Software von Boşa Gezme! stehen uns zu. Nutzerinhalte sind davon nicht erfasst.'},
          {p:'Auf der Plattform erscheinende Marken und Geschäftsbezeichnungen Dritter gehören ihren Inhabern; ihr Erscheinen begründet keine Beziehung oder Billigung.'},
          {p:`Wenn du eine Verletzung deiner Urheber- oder Markenrechte siehst, melde sie an ${mail}.`},
        ]},
        {id:'sorumluluk',heading:'13. Haftungsbeschränkung',blocks:[
          {p:'Boşa Gezme! ist eine Informations- und Entdeckungsplattform. Für Waren oder Leistungen eines Geschäfts, dessen Verhalten, Preise oder Bestand haften wir nicht; dieses Verhältnis besteht zwischen dir und dem Geschäft.'},
          {p:'Unsere Haftung ist im gesetzlich zulässigen Umfang beschränkt.'},
          {p:'Diese Beschränkung gilt nicht für Vorsatz und grobe Fahrlässigkeit, für Verletzungen von Persönlichkeitsrechten und für Haftung, die gesetzlich nicht beschränkt werden kann.'},
          {p:'Deine nicht abdingbaren Verbraucherrechte bleiben unberührt. Keine Bestimmung dieses Dokuments ist so auszulegen, dass sie diese einschränkt.'},
        ]},
        {id:'degisiklik',heading:'14. Änderungen dieser Bedingungen',blocks:[
          {p:'Wir können diese Bedingungen aktualisieren. Aktuelle Version und Gültigkeitsdatum stehen oben auf dieser Seite. Wesentliche Änderungen kündigen wir auf der Plattform an.'},
        ]},
        {id:'hukuk',heading:'15. Anwendbares Recht und zuständige Gerichte',blocks:[
          {p:'Auf diese Bedingungen ist türkisches Recht anwendbar.'},
          {p:'Zuständig sind die Gerichte und Vollstreckungsbehörden der Türkei. Handelst du als Verbraucher, bleibt dein Recht unberührt, dich an die Verbraucherschiedsstellen und an das Verbrauchergericht deines Wohnorts zu wenden.'},
        ]},
        {id:'diger',heading:'16. Sonstiges',blocks:[
          {p:'Ist eine Bestimmung unwirksam, bleiben die übrigen davon unberührt.'},
          {p:'Die Nichtausübung eines Rechts bedeutet keinen Verzicht darauf.'},
          {p:'Für genutzte Drittdienste wie Google Places und die Google-Anmeldung gelten deren eigene Bedingungen.'},
        ]},
      ],
    },
    ru:{
      title:'Условия использования',
      summary:'Пользуясь Boşa Gezme!, вы принимаете эти условия. Коротко: это платформа сообщества для поиска магазинов, она ничего не продаёт, присутствие в списке не означает партнёрства, и вы отвечаете за свой контент.',
      sections:[
        {id:'taraflar',heading:'1. Стороны и определения',blocks:[
          {p:`Настоящие условия заключены между ${controller}, управляющим платформой («Boşa Gezme!», «мы»), и пользователем («вы»). Контакт: ${mail}`},
          {p:'«Платформа» — сервис на bosagezme.com. «Контент» — ваши отзывы, комментарии и загруженные изображения.'},
        ]},
        {id:'hizmet',heading:'2. Чем сервис является и чем не является',blocks:[
          {p:'Boşa Gezme! — информационная платформа сообщества для поиска физических магазинов товаров для дома.'},
          {p:'Boşa Gezme! не является продавцом, владельцем магазина, торговцем, агентом или представителем магазина. Через платформу нельзя купить, заказать, забронировать или оплатить.'},
          {p:'Присутствие магазина само по себе не означает коммерческих отношений или партнёрства. Сейчас платного размещения, спонсорства и рекламы нет; будущие коммерческие соглашения будут явно обозначены.'},
        ]},
        {id:'yas',heading:'3. Возраст и аккаунт',blocks:[
          {p:`Для создания аккаунта вам должно быть не менее ${age} лет. Младше ${age} лет создавать аккаунт нельзя.`},
          {p:'Вы отвечаете за безопасность своего аккаунта. Защищайте доступ к почте для входа и сообщите нам о несанкционированном использовании.'},
          {p:'Без аккаунта можно просматривать платформу и читать отзывы. Для написания отзывов, избранного, лайков и подписок нужен вход.'},
        ]},
        {id:'kullanim',heading:'4. Допустимое использование',blocks:[
          {p:'Вы обязуетесь пользоваться платформой законно. Запрещается:'},
          {ul:[
            'Писать отзыв о магазине как о посещённом, если вы там не были',
            'Писать поддельные, вводящие в заблуждение или оплаченные отзывы',
            'Действовать согласованно, искусственно повышая или понижая рейтинг',
            'Оценивать свой бизнес или конкурента без раскрытия этого',
            'Выдавать себя за другого человека',
            'Публиковать оскорбления, преследование, угрозы, ненависть или дискриминацию',
            'Публиковать материалы сексуального характера или незаконный контент',
            'Раскрывать персональные данные других лиц без их согласия',
            'Публиковать рекламу, спам или посторонний коммерческий контент',
            'Загружать изображения, права на которые вам не принадлежат',
            'Нарушать работу платформы или обходить меры безопасности',
          ]},
        ]},
        {id:'icerik',heading:'5. Ваш контент и предоставляемая лицензия',blocks:[
          {p:'Ваш контент принадлежит вам. Мы не приобретаем на него право собственности.'},
          {p:'Чтобы мы могли публиковать его, вы предоставляете нам ограниченную лицензию: показывать, воспроизводить, форматировать и адаптировать контент под разные экраны на платформе и в её продвижении. Лицензия всемирная и безвозмездная, но ограничена работой и продвижением платформы.'},
          {p:'Лицензия прекращается при удалении контента или закрытии аккаунта, кроме копий во временных технических резервных копиях и контекста ответов других пользователей.'},
          {p:'Вы подтверждаете, что обладаете необходимыми правами на загружаемые изображения и не нарушаете права третьих лиц.'},
        ]},
        {id:'moderasyon',heading:'6. Модерация и жалобы',blocks:[
          {p:`О контенте, нарушающем правила, сообщайте на ${mail}. Мы рассматриваем обращения и можем удалить контент или ограничить аккаунт, если сочтём это необходимым.`},
          {note:'Сейчас нет ни автоматической системы модерации, ни формальной процедуры обжалования. Обращения рассматриваются вручную. Этот текст будет обновлён, когда это изменится.'},
          {p:'Наличие модерации не означает, что любой незаконный или недостоверный контент всегда будет выявлен. Неудалённый контент не считается одобренным.'},
        ]},
        {id:'ucuncu-taraf',heading:'7. Данные магазинов и сторонние источники',blocks:[
          {p:'Названия, адреса и координаты в основном поступают из сторонних источников, таких как Google Places, и могут быть устаревшими, неполными или неверными.'},
          {p:'Мы не гарантируем часы работы, цены, наличие товара, ассортимент, факт работы магазина и точность адреса. Рекомендуем проверять это самостоятельно перед поездкой.'},
          {p:'Отзывы — личные мнения их авторов. Boşa Gezme! не разделяет их и не гарантирует достоверность.'},
          {p:'Рейтинги и рекомендации — информационные средства для поиска, а не совет и не гарантия качества.'},
        ]},
        {id:'konum',heading:'8. Геофункции и безопасность',blocks:[
          {p:'Поиск и подтверждение визита используют местоположение. Оно поступает с вашего устройства и не всегда точно.'},
          {p:'За собственную безопасность по дороге в магазин отвечаете вы. Платформа не оценивает безопасность маршрута или места.'},
        ]},
        {id:'yapay-zeka',heading:'9. Поиск с использованием ИИ',blocks:[
          {p:'Для определения смысла запроса используется обработка с помощью ИИ. Она может давать неверные результаты; полнота и точность не гарантируются.'},
        ]},
        {id:'erisim',heading:'10. Доступность и изменения',blocks:[
          {p:'Бесперебойная работа не гарантируется. Сервис может быть временно недоступен из-за обслуживания, технических сбоев или обстоятельств вне нашего контроля, включая форс-мажор.'},
          {p:'Мы можем изменять, добавлять и удалять функции платформы.'},
        ]},
        {id:'askiya-alma',heading:'11. Приостановка и прекращение',blocks:[
          {p:'Аккаунты, нарушающие эти условия или правила сообщества, могут быть ограничены, приостановлены или закрыты. Мы действуем соразмерно и по возможности сообщаем причину.'},
          {p:'Вы можете удалить аккаунт самостоятельно в профиле. Последствия описаны на странице удаления аккаунта.'},
        ]},
        {id:'fikri',heading:'12. Интеллектуальная собственность',blocks:[
          {p:'Название, логотип, дизайн интерфейса и программное обеспечение Boşa Gezme! принадлежат нам. Пользовательский контент сюда не входит.'},
          {p:'Товарные знаки и наименования третьих лиц принадлежат их владельцам; их отображение не означает связи или одобрения.'},
          {p:`Если считаете, что нарушены ваши авторские или товарные права, сообщите на ${mail}.`},
        ]},
        {id:'sorumluluk',heading:'13. Ограничение ответственности',blocks:[
          {p:'Boşa Gezme! — информационная и поисковая платформа. Мы не отвечаем за товары и услуги магазина, его поведение, цены и наличие товара; эти отношения между вами и магазином.'},
          {p:'Наша ответственность ограничена в пределах, допускаемых применимым правом.'},
          {p:'Это ограничение не распространяется на умысел и грубую неосторожность, вред личным правам и ответственность, которую нельзя ограничить по закону.'},
          {p:'Ваши неотчуждаемые права потребителя сохраняются. Ни одно положение документа не может толковаться как их ограничение.'},
        ]},
        {id:'degisiklik',heading:'14. Изменения условий',blocks:[
          {p:'Мы можем обновлять эти условия. Текущая версия и дата вступления в силу указаны вверху страницы. О существенных изменениях сообщим на платформе.'},
        ]},
        {id:'hukuk',heading:'15. Применимое право и компетентные суды',blocks:[
          {p:'К настоящим условиям применяется право Турции.'},
          {p:'Компетентны суды и органы исполнения Турции. Если вы выступаете как потребитель, сохраняется ваше право обратиться в потребительские арбитражные комиссии и в потребительский суд по месту жительства.'},
        ]},
        {id:'diger',heading:'16. Прочие положения',blocks:[
          {p:'Недействительность одного положения не влияет на остальные.'},
          {p:'Неосуществление права не означает отказа от него.'},
          {p:'К сторонним сервисам, таким как Google Places и вход через Google, применяются их собственные условия.'},
        ]},
      ],
    },
  },
};

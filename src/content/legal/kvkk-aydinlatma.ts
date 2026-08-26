import {legalFacts} from '@/lib/legal-facts';
import type {LegalDoc} from './types';

const controller=legalFacts.legalEntityName??'';
const mail=legalFacts.privacyEmail??'';

// Article 10 requires the controller's identity, the purposes, the recipients, the method
// of collection and -- specifically -- the processing condition relied on. Vague wording
// such as "processed pursuant to articles 5 and 6" is what this document is written to
// avoid: every row below names the condition that actually applies to that activity.
//
// Every purpose and every recipient is taken from code. Where the code does something the
// user would not expect (the email address surviving deletion, a saved location stored at
// full precision), it is stated rather than smoothed over.
export const kvkkAydinlatma:LegalDoc={
  slug:'kvkk/aydinlatma-metni',
  version:'1.1',
  effective:'2026-08-19',
  updated:'2026-08-20',
  requiresEntity:true,
  content:{
    tr:{
      title:'KVKK Aydınlatma Metni',
      summary:`6698 sayılı Kanun'un 10. maddesi uyarınca, kişisel verilerinizin hangi amaçla, hangi hukuki sebebe dayanılarak işlendiğini ve kimlere aktarıldığını faaliyet faaliyet açıklıyoruz. Veri sorumlusu: ${controller}.`,
      sections:[
        {id:'sorumlu',heading:'Veri sorumlusunun kimliği',blocks:[
          {p:`Bu platformda işlenen kişisel veriler bakımından veri sorumlusu ${controller}'tır (gerçek kişi). Başvuru ve iletişim adresi: ${mail}`},
          {note:'Veri sorumlusu bir tüzel kişi değil, gerçek kişidir. Bu, sorumluluğun kapsamını değiştirmez; Kanun kapsamındaki tüm yükümlülükler geçerlidir.'},
        ]},
        {id:'faaliyetler',heading:'Faaliyet bazında işleme şartları',blocks:[
          {p:'Her satır, o faaliyet için fiilen dayanılan işleme şartını gösterir.'},
          {table:{head:['Faaliyet','İşlenen veri','Amaç','Hukuki sebep (KVKK)'],rows:[
            ['Hesap oluşturma ve giriş','E-posta adresi, herkese açık olmayan teknik hesap kimliği, görünen ad','Hesabın kurulması ve kimlik doğrulama','m.5/2-c — sözleşmenin kurulması ve ifası için zorunlu olması'],
            ['E-posta ile tek kullanımlık kod','E-posta, kodun özeti, IP adresinin özeti, deneme sayısı','Girişin güvenliği ve kötüye kullanımın önlenmesi','m.5/2-f — meşru menfaat (hesap güvenliği)'],
            ['Google ile giriş','Google tarafından sağlanan kimlik ve e-posta','Kimlik doğrulama','m.5/2-c — sözleşmenin ifası'],
            ['Oturum yönetimi','Yenileme jetonunun özeti, istemci türü, cihaz bilgisi','Oturumun sürdürülmesi ve çalınmış jetonun tespiti','m.5/2-f — meşru menfaat (güvenlik)'],
            ['Değerlendirme, yorum, beğeni, takip, favori','Yazdığınız içerik ve etkileşimleriniz','Hizmetin temel işlevinin sunulması','m.5/2-c — sözleşmenin ifası'],
            ['Ziyaret doğrulama','Mağazaya uzaklık ve cihazın bildirdiği doğruluk payı (koordinat saklanmaz)','Değerlendirmenin gerçekten ziyaret edenlerden gelmesi','m.5/2-c — sözleşmenin ifası'],
            ['Arama','Sorgu metni, kabalaştırılmış koordinatlar, sonuç ve tıklama kayıtları','Sonuçların mesafeye göre sıralanması ve hizmetin iyileştirilmesi','m.5/2-f — meşru menfaat'],
            ['Kaydedilen keşif konumu','Tam hassasiyetli konum, etiket, adres','Her aramada konum sorulmaması','m.5/1 — açık rıza (bu tercihi kendiniz kaydedersiniz)'],
            ['Özel profil bilgileri','İlişki durumu, çocuk yaş aralıkları, konut durumu, meslek, yaş aralığı, ilgi alanları','Önerilerin kişiselleştirilmesi','m.5/1 — açık rıza (tamamı isteğe bağlıdır)'],
            ['Görsel yükleme','Yüklediğiniz görseller ve teknik meta verileri','İçeriğin yayımlanması','m.5/2-c — sözleşmenin ifası'],
            ['Ziyaretçi oturumu','Anonim oturum kimliği','Giriş yapmadan gezinebilme','m.5/2-f — meşru menfaat'],
            ['Görüş ve öneri gönderme','Mesajınız ve yanıt isterseniz verdiğiniz e-posta adresi','Ürünün iyileştirilmesi ve size dönüş yapılabilmesi','m.5/2-f — meşru menfaat (ürünün geliştirilmesi)'],
            ['Güvenlik ve işlem kayıtları','İstek kimliği, hata ve erişim kayıtları','Sistem güvenliği ve hukuki yükümlülük','m.5/2-ç — hukuki yükümlülük ve m.5/2-f'],
          ]}},
          {note:'Açık rızaya dayanan iki faaliyet (kaydedilen konum ve özel profil bilgileri) hizmete erişimin şartı değildir. Rızanızı vermeseniz de platformu kullanabilirsiniz; verdikten sonra da her zaman geri alabilirsiniz.'},
        ]},
        {id:'toplama',heading:'Toplama yöntemi',blocks:[
          {p:'Veriler; hesap oluştururken ve platformu kullanırken doğrudan sizden, tarayıcınızın izninizle sağladığı konum bilgisinden ve Google ile giriş yapmayı seçmeniz halinde Google Identity Services üzerinden elektronik ortamda toplanır.'},
        ]},
        {id:'aktarim',heading:'Aktarılan taraflar ve aktarım amacı',blocks:[
          {table:{head:['Alıcı','Aktarılan veri','Aktarım amacı'],rows:[
            ['Google Places','Arama metni, koordinatlar, arama yarıçapı','Mağaza sonuçlarının getirilmesi'],
            ['Google Identity Services','Kimlik doğrulama verisi','Google ile giriş'],
            ['Google (Gmail API)','E-posta adresi ve mesaj içeriği','Doğrulama ve bilgilendirme e-postalarının iletilmesi'],
            ['Bulut depolama sağlayıcısı','Yüklediğiniz görseller','Görsellerin saklanması ve sunulması'],
            ['OpenAI','Yalnızca arama sorgunuzun metni ve dil tercihiniz','Aramanın ne aradığınızı anlaması'],
          ]}},
          {p:'OpenAI’a konum bilgisi, kullanıcı kimliği veya e-posta adresi gönderilmez. Gönderilen tek şey yazdığınız arama metni ve dil tercihinizdir.'},
          {p:'Bu hizmetlerin sunucuları yurt dışında bulunabilir; bu durumda Kanun’un 9. maddesi kapsamında yurt dışına aktarım söz konusu olur. Aktarımın hangi mekanizmaya dayandığı hukuki inceleme aşamasındadır.'},
          {note:'Bu platformda reklam ağı, analitik sağlayıcı veya pazarlama sistemi kullanılmamaktadır. Verileriniz bu amaçlarla üçüncü taraflara aktarılmaz.'},
        ]},
        {id:'saklama',heading:'Saklama süreleri',blocks:[
          {table:{head:['Veri','Süre'],rows:[
            ['Arama kayıtları','365 gün'],
            ['Aramadaki konum bilgisi','30 gün sonra silinir'],
            ['Ziyaretçi oturumları','180 gün'],
            ['E-posta doğrulama kodları','30 gün'],
            ['Oturum kayıtları','Süre dolduktan veya iptal edildikten 30 gün sonra'],
            ['Ziyaret doğrulamaları','Süre dolduktan veya kullanıldıktan 30 gün sonra'],
            ['Gönderilen e-posta kayıtları','90 gün'],
          ]}},
          {p:'Değerlendirmeler, yorumlar, favoriler ve yüklediğiniz görseller, siz silmediğiniz veya hesabınızı kapatmadığınız sürece saklanır.'},
        ]},
        {id:'haklar',heading:'11. madde kapsamındaki haklarınız',blocks:[
          {ul:[
            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
            'İşlenmişse buna ilişkin bilgi talep etme',
            'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
            'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
            'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
            'Kanun’daki şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
            'Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme',
            'Münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonuç ortaya çıkmasına itiraz etme',
            'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
          ]},
          {p:`Bu haklarınızı kullanmak için ${mail} adresine başvurabilirsiniz. Başvuru yöntemleri ve sürecin işleyişi için KVKK başvuru sayfasına bakabilirsiniz.`},
        ]},
        {id:'mevzuat',heading:'İlgili mevzuat',blocks:[
          {p:'Kanun metnine mevzuat.gov.tr üzerinden, Kurul kararlarına ve rehberlere kvkk.gov.tr üzerinden ulaşabilirsiniz.'},
        ]},
      ],
    },
    en:{
      title:'KVKK Disclosure Notice',
      summary:`Under article 10 of Law No. 6698, this notice states activity by activity why your personal data is processed, which processing condition is relied on, and who it is transferred to. Data controller: ${controller}.`,
      sections:[
        {id:'sorumlu',heading:'Identity of the data controller',blocks:[
          {p:`The data controller for personal data processed on this platform is ${controller}, a natural person. Application and contact address: ${mail}`},
          {note:'The controller is a natural person rather than a company. This does not narrow the scope of responsibility; all obligations under the Law apply.'},
        ]},
        {id:'faaliyetler',heading:'Processing conditions, activity by activity',blocks:[
          {p:'Each row names the processing condition actually relied on for that activity.'},
          {table:{head:['Activity','Data','Purpose','Legal ground (KVKK)'],rows:[
            ['Account creation and sign-in','Email address, non-public technical account identifier, display name','Creating the account and verifying identity','art. 5/2-c — necessary for the performance of a contract'],
            ['Email one-time code','Email, hash of the code, hash of the request IP, attempt count','Sign-in security and abuse prevention','art. 5/2-f — legitimate interest (account security)'],
            ['Google sign-in','Identifier and email provided by Google','Authentication','art. 5/2-c — performance of a contract'],
            ['Session management','Hash of the refresh token, client type, device metadata','Maintaining the session and detecting stolen tokens','art. 5/2-f — legitimate interest (security)'],
            ['Reviews, comments, likes, follows, favourites','The content you write and your interactions','Providing the core function of the service','art. 5/2-c — performance of a contract'],
            ['Visit verification','Distance to the store and the accuracy your device reported (no coordinates stored)','Keeping reviews to people who genuinely visited','art. 5/2-c — performance of a contract'],
            ['Search','Query text, coarsened coordinates, result and click records','Ordering results by distance and improving the service','art. 5/2-f — legitimate interest'],
            ['Saved discovery location','Full-precision location, label, address','Not asking for a location on every search','art. 5/1 — explicit consent (you choose to save it)'],
            ['Private profile details','Relationship status, children’s age ranges, housing status, occupation, age range, interests','Personalising recommendations','art. 5/1 — explicit consent (entirely optional)'],
            ['Media upload','Images you upload and their technical metadata','Publishing your content','art. 5/2-c — performance of a contract'],
            ['Visitor session','Anonymous session identifier','Browsing without signing in','art. 5/2-f — legitimate interest'],
            ['Sending feedback','Your message and, if you ask for a reply, the email address you give','Improving the product and being able to answer you','Art. 5/2-f — legitimate interest (improving the product)'],
            ['Security and operational logs','Request identifier, error and access logs','System security and legal obligations','art. 5/2-ç — legal obligation, and art. 5/2-f'],
          ]}},
          {note:'The two activities based on explicit consent (saved location and private profile details) are not a condition of using the service. You can use the platform without giving them, and you can withdraw consent at any time afterwards.'},
        ]},
        {id:'toplama',heading:'Method of collection',blocks:[
          {p:'Data is collected electronically: directly from you when you create an account and use the platform, from the location your browser provides with your permission, and through Google Identity Services if you choose to sign in with Google.'},
        ]},
        {id:'aktarim',heading:'Recipients and purpose of transfer',blocks:[
          {table:{head:['Recipient','Data transferred','Purpose'],rows:[
            ['Google Places','Search text, coordinates, search radius','Returning store results'],
            ['Google Identity Services','Authentication data','Signing in with Google'],
            ['Google (Gmail API)','Email address and message content','Delivering verification and notice emails'],
            ['Cloud storage provider','Images you upload','Storing and serving images'],
            ['OpenAI','Only your search query text and language preference','Interpreting what your search means'],
          ]}},
          {p:'No location, user identifier or email address is sent to OpenAI. The only things sent are the search text you typed and your language preference.'},
          {p:'These services may operate servers outside Türkiye, in which case a transfer abroad under article 9 of the Law arises. The mechanism relied on for that transfer is under legal review.'},
          {note:'No advertising network, analytics provider or marketing system is used on this platform. Your data is not transferred to third parties for those purposes.'},
        ]},
        {id:'saklama',heading:'Retention periods',blocks:[
          {table:{head:['Data','Period'],rows:[
            ['Search records','365 days'],
            ['Location within a search','Deleted after 30 days'],
            ['Visitor sessions','180 days'],
            ['Email verification codes','30 days'],
            ['Session records','30 days after expiry or revocation'],
            ['Visit verifications','30 days after expiry or use'],
            ['Sent email records','90 days'],
          ]}},
          {p:'Reviews, comments, favourites and images you upload are kept until you delete them or close your account.'},
        ]},
        {id:'haklar',heading:'Your rights under article 11',blocks:[
          {ul:[
            'To learn whether your personal data is processed',
            'To request information if it has been processed',
            'To learn the purpose and whether it is used in accordance with that purpose',
            'To know the third parties to whom it is transferred, in Türkiye or abroad',
            'To request correction if it is incomplete or inaccurate',
            'To request erasure or destruction within the conditions of the Law',
            'To request that correction, erasure and destruction be notified to third parties it was transferred to',
            'To object to a result against you arising from analysis solely by automated systems',
            'To claim compensation for damage arising from unlawful processing',
          ]},
          {p:`To exercise these rights, apply to ${mail}. The application methods and how the process works are set out on the KVKK application page.`},
        ]},
        {id:'mevzuat',heading:'Relevant legislation',blocks:[
          {p:'The text of the Law is available at mevzuat.gov.tr, and Board decisions and guidance at kvkk.gov.tr.'},
        ]},
      ],
    },
    de:{
      title:'KVKK-Informationstext',
      summary:`Gemäß Artikel 10 des Gesetzes Nr. 6698 erläutert dieser Text tätigkeitsbezogen, zu welchem Zweck und auf welcher Rechtsgrundlage personenbezogene Daten verarbeitet und an wen sie übermittelt werden. Verantwortlicher: ${controller}.`,
      sections:[
        {id:'sorumlu',heading:'Identität des Verantwortlichen',blocks:[
          {p:`Verantwortlicher für die auf dieser Plattform verarbeiteten personenbezogenen Daten ist ${controller}, eine natürliche Person. Antrags- und Kontaktadresse: ${mail}`},
          {note:'Der Verantwortliche ist eine natürliche Person und kein Unternehmen. Das schränkt den Umfang der Verantwortung nicht ein; sämtliche Pflichten nach dem Gesetz gelten.'},
        ]},
        {id:'faaliyetler',heading:'Verarbeitungsgrundlagen nach Tätigkeit',blocks:[
          {p:'Jede Zeile nennt die für diese Tätigkeit tatsächlich herangezogene Verarbeitungsgrundlage.'},
          {table:{head:['Tätigkeit','Daten','Zweck','Rechtsgrundlage (KVKK)'],rows:[
            ['Kontoerstellung und Anmeldung','E-Mail-Adresse, nicht öffentliche technische Kontokennung, Anzeigename','Einrichtung des Kontos und Authentifizierung','Art. 5/2-c — zur Vertragserfüllung erforderlich'],
            ['Einmalcode per E-Mail','E-Mail, Hash des Codes, Hash der Anfrage-IP, Versuchszähler','Anmeldesicherheit und Missbrauchsprävention','Art. 5/2-f — berechtigtes Interesse (Kontosicherheit)'],
            ['Google-Anmeldung','Von Google bereitgestellte Kennung und E-Mail','Authentifizierung','Art. 5/2-c — Vertragserfüllung'],
            ['Sitzungsverwaltung','Hash des Refresh-Tokens, Client-Typ, Gerätedaten','Aufrechterhaltung der Sitzung und Erkennung gestohlener Token','Art. 5/2-f — berechtigtes Interesse (Sicherheit)'],
            ['Bewertungen, Kommentare, Likes, Follows, Favoriten','Deine Inhalte und Interaktionen','Bereitstellung der Kernfunktion','Art. 5/2-c — Vertragserfüllung'],
            ['Besuchsbestätigung','Entfernung zum Geschäft und gemeldete Genauigkeit (keine Koordinaten gespeichert)','Bewertungen von tatsächlichen Besuchern','Art. 5/2-c — Vertragserfüllung'],
            ['Suche','Suchtext, vergröberte Koordinaten, Ergebnis- und Klickdaten','Sortierung nach Entfernung und Verbesserung des Dienstes','Art. 5/2-f — berechtigtes Interesse'],
            ['Gespeicherter Entdeckungsstandort','Standort in voller Genauigkeit, Bezeichnung, Adresse','Keine Standortabfrage bei jeder Suche','Art. 5/1 — ausdrückliche Einwilligung'],
            ['Private Profilangaben','Beziehungsstatus, Altersgruppen von Kindern, Wohnsituation, Beruf, Altersgruppe, Interessen','Personalisierung von Empfehlungen','Art. 5/1 — ausdrückliche Einwilligung (freiwillig)'],
            ['Medien-Upload','Hochgeladene Bilder und deren technische Metadaten','Veröffentlichung deiner Inhalte','Art. 5/2-c — Vertragserfüllung'],
            ['Besuchersitzung','Anonyme Sitzungskennung','Nutzung ohne Anmeldung','Art. 5/2-f — berechtigtes Interesse'],
            ['Rückmeldung senden','Deine Nachricht und, wenn du eine Antwort möchtest, die angegebene E-Mail-Adresse','Verbesserung des Produkts und Antwort an dich','Art. 5/2-f — berechtigtes Interesse (Produktverbesserung)'],
            ['Sicherheits- und Betriebsprotokolle','Anfragekennung, Fehler- und Zugriffsprotokolle','Systemsicherheit und rechtliche Pflichten','Art. 5/2-ç — rechtliche Pflicht und Art. 5/2-f'],
          ]}},
          {note:'Die beiden auf ausdrücklicher Einwilligung beruhenden Tätigkeiten sind keine Bedingung für die Nutzung des Dienstes. Du kannst die Plattform ohne sie nutzen und die Einwilligung jederzeit widerrufen.'},
        ]},
        {id:'toplama',heading:'Art der Erhebung',blocks:[
          {p:'Die Erhebung erfolgt elektronisch: unmittelbar von dir bei Kontoerstellung und Nutzung, aus dem mit deiner Erlaubnis vom Browser bereitgestellten Standort und über Google Identity Services, wenn du dich für die Google-Anmeldung entscheidest.'},
        ]},
        {id:'aktarim',heading:'Empfänger und Zweck der Übermittlung',blocks:[
          {table:{head:['Empfänger','Übermittelte Daten','Zweck'],rows:[
            ['Google Places','Suchtext, Koordinaten, Suchradius','Lieferung von Geschäftsergebnissen'],
            ['Google Identity Services','Authentifizierungsdaten','Anmeldung mit Google'],
            ['Google (Gmail API)','E-Mail-Adresse und Nachrichteninhalt','Zustellung von Bestätigungs- und Hinweis-E-Mails'],
            ['Cloud-Speicheranbieter','Hochgeladene Bilder','Speicherung und Auslieferung von Bildern'],
            ['OpenAI','Nur der Text deiner Suchanfrage und deine Spracheinstellung','Auswertung der Bedeutung deiner Suche'],
          ]}},
          {p:'An OpenAI werden weder Standort noch Nutzerkennung oder E-Mail-Adresse übermittelt. Übermittelt werden nur der eingegebene Suchtext und die Spracheinstellung.'},
          {p:'Diese Dienste können Server außerhalb der Türkei betreiben; in diesem Fall liegt eine Übermittlung ins Ausland nach Artikel 9 vor. Der herangezogene Mechanismus wird rechtlich geprüft.'},
          {note:'Auf dieser Plattform werden keine Werbenetzwerke, Analyseanbieter oder Marketingsysteme eingesetzt.'},
        ]},
        {id:'saklama',heading:'Aufbewahrungsfristen',blocks:[
          {table:{head:['Daten','Frist'],rows:[
            ['Suchdatensätze','365 Tage'],
            ['Standort innerhalb einer Suche','Nach 30 Tagen gelöscht'],
            ['Besuchersitzungen','180 Tage'],
            ['E-Mail-Bestätigungscodes','30 Tage'],
            ['Sitzungsdatensätze','30 Tage nach Ablauf oder Widerruf'],
            ['Besuchsbestätigungen','30 Tage nach Ablauf oder Verwendung'],
            ['Datensätze gesendeter E-Mails','90 Tage'],
          ]}},
          {p:'Bewertungen, Kommentare, Favoriten und hochgeladene Bilder bleiben gespeichert, bis du sie löschst oder dein Konto schließt.'},
        ]},
        {id:'haklar',heading:'Deine Rechte nach Artikel 11',blocks:[
          {ul:[
            'Zu erfahren, ob deine personenbezogenen Daten verarbeitet werden',
            'Auskunft zu verlangen, wenn sie verarbeitet wurden',
            'Den Zweck zu erfahren und ob sie zweckentsprechend verwendet werden',
            'Die Empfänger im In- und Ausland zu kennen',
            'Berichtigung bei Unvollständigkeit oder Unrichtigkeit zu verlangen',
            'Löschung oder Vernichtung im Rahmen des Gesetzes zu verlangen',
            'Die Mitteilung dieser Maßnahmen an Dritte zu verlangen',
            'Einem ausschließlich automatisiert erzeugten nachteiligen Ergebnis zu widersprechen',
            'Ersatz des durch rechtswidrige Verarbeitung entstandenen Schadens zu verlangen',
          ]},
          {p:`Zur Ausübung dieser Rechte wende dich an ${mail}. Die Antragswege sind auf der KVKK-Antragsseite beschrieben.`},
        ]},
        {id:'mevzuat',heading:'Einschlägige Rechtsvorschriften',blocks:[
          {p:'Der Gesetzestext ist unter mevzuat.gov.tr abrufbar, Entscheidungen und Leitlinien unter kvkk.gov.tr.'},
        ]},
      ],
    },
    ru:{
      title:'Уведомление KVKK',
      summary:`В соответствии со статьёй 10 Закона № 6698 здесь по каждому виду деятельности указано, с какой целью и на каком правовом основании обрабатываются персональные данные и кому они передаются. Оператор данных: ${controller}.`,
      sections:[
        {id:'sorumlu',heading:'Личность оператора данных',blocks:[
          {p:`Оператором персональных данных на этой платформе является ${controller}, физическое лицо. Адрес для обращений: ${mail}`},
          {note:'Оператор — физическое лицо, а не компания. Это не сужает объём ответственности: все обязанности по Закону применяются.'},
        ]},
        {id:'faaliyetler',heading:'Основания обработки по видам деятельности',blocks:[
          {p:'В каждой строке указано основание, которое фактически применяется к этой деятельности.'},
          {table:{head:['Деятельность','Данные','Цель','Правовое основание (KVKK)'],rows:[
            ['Создание аккаунта и вход','Адрес эл. почты, непубличный технический идентификатор, отображаемое имя','Создание аккаунта и проверка личности','ст. 5/2-c — необходимо для исполнения договора'],
            ['Одноразовый код по почте','Почта, хеш кода, хеш IP-адреса, число попыток','Безопасность входа и предотвращение злоупотреблений','ст. 5/2-f — законный интерес (безопасность)'],
            ['Вход через Google','Идентификатор и почта от Google','Аутентификация','ст. 5/2-c — исполнение договора'],
            ['Управление сессиями','Хеш токена обновления, тип клиента, данные устройства','Поддержание сессии и выявление украденных токенов','ст. 5/2-f — законный интерес'],
            ['Отзывы, комментарии, лайки, подписки, избранное','Ваш контент и взаимодействия','Предоставление основной функции сервиса','ст. 5/2-c — исполнение договора'],
            ['Подтверждение визита','Расстояние до магазина и заявленная точность (координаты не хранятся)','Отзывы только от действительно посетивших','ст. 5/2-c — исполнение договора'],
            ['Поиск','Текст запроса, огрублённые координаты, записи результатов и кликов','Сортировка по расстоянию и улучшение сервиса','ст. 5/2-f — законный интерес'],
            ['Сохранённое место поиска','Точное местоположение, название, адрес','Чтобы не запрашивать место при каждом поиске','ст. 5/1 — явное согласие'],
            ['Приватные данные профиля','Семейное положение, возрастные группы детей, жильё, профессия, возраст, интересы','Персонализация рекомендаций','ст. 5/1 — явное согласие (полностью добровольно)'],
            ['Загрузка изображений','Загруженные изображения и их технические метаданные','Публикация вашего контента','ст. 5/2-c — исполнение договора'],
            ['Сессия посетителя','Анонимный идентификатор сессии','Просмотр без входа','ст. 5/2-f — законный интерес'],
            ['Отправка отзыва','Ваше сообщение и, если вы хотите ответ, указанный адрес эл. почты','Улучшение продукта и возможность вам ответить','ст. 5/2-f — законный интерес (улучшение продукта)'],
            ['Журналы безопасности','Идентификатор запроса, журналы ошибок и доступа','Безопасность системы и правовые обязанности','ст. 5/2-ç — правовая обязанность и ст. 5/2-f'],
          ]}},
          {note:'Две деятельности на основе явного согласия не являются условием пользования сервисом. Вы можете пользоваться платформой без них и в любой момент отозвать согласие.'},
        ]},
        {id:'toplama',heading:'Способ сбора',blocks:[
          {p:'Данные собираются в электронной форме: непосредственно от вас при создании аккаунта и пользовании платформой, из местоположения, предоставленного браузером с вашего разрешения, и через Google Identity Services, если вы выбрали вход через Google.'},
        ]},
        {id:'aktarim',heading:'Получатели и цели передачи',blocks:[
          {table:{head:['Получатель','Передаваемые данные','Цель'],rows:[
            ['Google Places','Текст запроса, координаты, радиус поиска','Получение результатов по магазинам'],
            ['Google Identity Services','Данные аутентификации','Вход через Google'],
            ['Google (Gmail API)','Адрес почты и содержание сообщения','Доставка писем подтверждения и уведомлений'],
            ['Облачное хранилище','Загруженные изображения','Хранение и выдача изображений'],
            ['OpenAI','Только текст поискового запроса и язык','Определение смысла запроса'],
          ]}},
          {p:'В OpenAI не передаются ни местоположение, ни идентификатор пользователя, ни адрес почты — только введённый текст запроса и языковая настройка.'},
          {p:'Серверы этих сервисов могут находиться за пределами Турции; в таком случае возникает передача за рубеж по статье 9. Применяемый механизм находится на юридической проверке.'},
          {note:'На платформе не используются рекламные сети, аналитические сервисы и маркетинговые системы.'},
        ]},
        {id:'saklama',heading:'Сроки хранения',blocks:[
          {table:{head:['Данные','Срок'],rows:[
            ['Записи поиска','365 дней'],
            ['Местоположение в записи поиска','Удаляется через 30 дней'],
            ['Сессии посетителей','180 дней'],
            ['Коды подтверждения почты','30 дней'],
            ['Записи сессий','30 дней после истечения или отзыва'],
            ['Подтверждения визитов','30 дней после истечения или использования'],
            ['Записи отправленных писем','90 дней'],
          ]}},
          {p:'Отзывы, комментарии, избранное и загруженные изображения хранятся, пока вы их не удалите или не закроете аккаунт.'},
        ]},
        {id:'haklar',heading:'Ваши права по статье 11',blocks:[
          {ul:[
            'Узнать, обрабатываются ли ваши персональные данные',
            'Запросить информацию, если они обрабатывались',
            'Узнать цель и соответствие использования этой цели',
            'Знать третьих лиц внутри страны и за рубежом, которым они переданы',
            'Требовать исправления при неполноте или неточности',
            'Требовать удаления или уничтожения в рамках Закона',
            'Требовать уведомления об этом третьих лиц',
            'Возражать против неблагоприятного результата, полученного исключительно автоматизированной обработкой',
            'Требовать возмещения ущерба от незаконной обработки',
          ]},
          {p:`Для реализации этих прав обратитесь по адресу ${mail}. Способы подачи описаны на странице обращения KVKK.`},
        ]},
        {id:'mevzuat',heading:'Применимое законодательство',blocks:[
          {p:'Текст Закона доступен на mevzuat.gov.tr, решения и руководства — на kvkk.gov.tr.'},
        ]},
      ],
    },
  },
};

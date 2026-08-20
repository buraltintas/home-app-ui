import {legalFacts} from '@/lib/legal-facts';
import type {LegalDoc} from './types';

const controller=legalFacts.legalEntityName??'';
const mail=legalFacts.privacyEmail??'';

// The per-activity legal-basis table lives in the KVKK notice and is deliberately not
// repeated here. Two copies of the same table in four languages would drift apart, and a
// privacy policy that contradicts the KVKK notice is worse than one that points to it.
//
// This document is the plain-language layer: what is collected, what leaves the system,
// what is kept and for how long, and the two things a reader would not guess -- that a
// saved location is stored precisely, and that the email address outlives deletion.
export const privacy:LegalDoc={
  slug:'privacy',
  version:'1.1',
  effective:'2026-08-19',
  updated:'2026-08-20',
  requiresEntity:true,
  content:{
    tr:{
      title:'Gizlilik Politikası',
      summary:`Bu sayfa, Boşa Gezme!'nin hangi bilgileri topladığını, bunların nereye gittiğini ve ne kadar saklandığını sade bir dille anlatır. Veri sorumlusu ${controller}. Hukuki dayanakların faaliyet bazında dökümü KVKK aydınlatma metnindedir.`,
      sections:[
        {id:'ozet',heading:'Kısa özet',blocks:[
          {ul:[
            'Reklam ve analitik takibi yapılmıyor. Google Analytics, reklam pikseli veya benzeri bir izleme aracı kullanılmıyor.',
            'Aramadaki konumunuz kabalaştırılarak saklanıyor ve 30 gün sonra siliniyor.',
            'Ziyaret doğrulamasında koordinatınız hiç saklanmıyor; yalnızca mağazaya uzaklık kaydediliyor.',
            'Kendiniz kaydettiğiniz keşif konumu ise tam hassasiyetle saklanıyor.',
            'Hesabınızı silseniz de e-posta adresiniz saklanıyor; bunun tek sebebi hesabı yeniden açabilmeniz.',
            'Yapay zekâ servisine yalnızca arama metniniz ve dil tercihiniz gidiyor; konumunuz veya kimliğiniz gitmiyor.',
          ]},
        ]},
        {id:'toplanan',heading:'Toplanan bilgiler',blocks:[
          {h3:'Siz verdikçe'},
          {ul:[
            'Hesap: e-posta adresi, kullanıcı adı, görünen ad, dil tercihi',
            'İsteğe bağlı profil: biyografi, şehir, profil görseli',
            'İsteğe bağlı özel profil: ilişki durumu, çocuk yaş aralıkları, konut durumu, meslek, yaş aralığı, ilgi alanları',
            'İçerik: değerlendirmeler, puanlar, yorumlar, yüklediğiniz görseller',
            'Etkileşim: beğeni, favori, takip',
            'Bize gönderdiğiniz görüş ve öneriler: mesajınız ve yazdıysanız yanıt için verdiğiniz e-posta adresi. Bunlar yayınlanmaz.',
          ]},
          {h3:'Kullanırken oluşan'},
          {ul:[
            'Arama sorgularınız ve gösterilen sonuçlar',
            'Konum bilgisi (yukarıdaki üç farklı davranışa göre)',
            'Ziyaretçi oturumu kimliği (giriş yapmadan gezerken)',
            'Oturum kayıtları: yenileme jetonunun özeti, istemci türü, cihaz bilgisi',
            'Güvenlik kayıtları: istek kimliği, hata ve erişim kayıtları',
          ]},
          {note:'Giriş kodu isteklerinde IP adresiniz yalnızca özetlenerek (hash) saklanır, açık hâliyle tutulmaz.'},
        ]},
        {id:'kaynak',heading:'Bilgilerin kaynağı',blocks:[
          {p:'Bilgilerin çoğunu doğrudan sizden alırız. Google ile giriş yapmayı seçerseniz kimliğiniz ve e-posta adresiniz Google Identity Services üzerinden gelir. Mağazalara ait bilgiler (ad, adres, konum) büyük ölçüde Google Places kaynaklıdır ve kişisel verileriniz değildir.'},
        ]},
        {id:'paylasim',heading:'Kimlerle paylaşılıyor',blocks:[
          {table:{head:['Alıcı','Giden bilgi'],rows:[
            ['Google Places','Arama metni, koordinatlar, arama yarıçapı'],
            ['Google Identity Services','Google ile giriş seçilirse kimlik doğrulama verisi'],
            ['Google (Gmail API)','E-posta adresiniz ve gönderilen mesajın içeriği'],
            ['Bulut depolama','Yüklediğiniz görseller'],
            ['OpenAI','Yalnızca arama metniniz ve dil tercihiniz'],
          ]}},
          {p:'Bu hizmetlerin sunucuları yurt dışında olabilir. Verileriniz reklam veya pazarlama amacıyla hiçbir tarafla paylaşılmaz, satılmaz.'},
        ]},
        {id:'saklama',heading:'Saklama ve silme',blocks:[
          {p:'Arama kayıtları 365 gün, aramadaki konum 30 gün, ziyaretçi oturumları 180 gün, e-posta doğrulama kodları 30 gün, oturum ve ziyaret doğrulama kayıtları süre bitiminden 30 gün sonra, gönderilen e-posta kayıtları 90 gün sonra silinir.'},
          {p:'Değerlendirmeleriniz, yorumlarınız, favorileriniz ve görselleriniz siz silene veya hesabınızı kapatana kadar saklanır.'},
          {p:'Hesabınızı sildiğinizde neyin silindiği, neyin anonimleştirildiği ve e-posta adresinizin neden saklandığı hesap silme sayfasında tek tek yazılıdır.'},
        ]},
        {id:'guvenlik',heading:'Güvenlik',blocks:[
          {p:'Jetonlar ve bildirim anahtarları veritabanında özetlenerek saklanır, açık hâliyle tutulmaz. Giriş jetonları kısa ömürlüdür. Tarayıcı hiçbir zaman doğrudan uygulama sunucusuna bağlanmaz; tüm istekler kendi sunucumuz üzerinden geçer.'},
          {p:'Hiçbir sistem tamamen güvenli değildir. Bu sayfadaki hiçbir ifade mutlak güvenlik taahhüdü olarak anlaşılmamalıdır.'},
        ]},
        {id:'cocuk',heading:'Çocuklar',blocks:[
          {p:`Bu platform ${legalFacts.minimumAge} yaşından küçükler için tasarlanmamıştır. Bu yaşın altındaki birine ait bir hesabı öğrenirsek kapatırız.`},
        ]},
        {id:'haklar',heading:'Haklarınız',blocks:[
          {p:`Kişisel verilerinize erişme, düzeltme, silme ve rızanızı geri çekme haklarınız vardır. ${mail} adresine yazabilir veya KVKK başvuru sayfasındaki yolu izleyebilirsiniz.`},
        ]},
        {id:'degisiklik',heading:'Değişiklikler',blocks:[
          {p:'Bu politikayı güncellediğimizde sürüm numarası ve tarih sayfanın başında değişir. Önemli değişiklikleri platform üzerinden duyururuz.'},
        ]},
      ],
    },
    en:{
      title:'Privacy Policy',
      summary:`This page explains in plain language what Boşa Gezme! collects, where it goes and how long it is kept. The data controller is ${controller}. The activity-by-activity breakdown of legal grounds is in the KVKK disclosure notice.`,
      sections:[
        {id:'ozet',heading:'Short summary',blocks:[
          {ul:[
            'There is no advertising or analytics tracking. No Google Analytics, ad pixel or similar tool is used.',
            'Your search location is coarsened before storage and deleted after 30 days.',
            'Visit verification stores no coordinates at all, only your distance to the store.',
            'A discovery location you save yourself is stored at full precision.',
            'Your email address is kept even after you delete your account, solely so it can be reopened.',
            'Only your search text and language go to the AI service; your location and identity do not.',
          ]},
        ]},
        {id:'toplanan',heading:'What is collected',blocks:[
          {h3:'What you provide'},
          {ul:[
            'Account: email address, username, display name, language preference',
            'Optional profile: bio, city, profile image',
            'Optional private profile: relationship status, children’s age ranges, housing status, occupation, age range, interests',
            'Content: reviews, ratings, comments, images you upload',
            'Interactions: likes, favourites, follows',
            'Feedback you send us: your message, and the email address you give for a reply if you give one. It is never published.',
          ]},
          {h3:'What arises from use'},
          {ul:[
            'Your search queries and the results shown',
            'Location (according to the three distinct behaviours above)',
            'Visitor session identifier, when browsing without signing in',
            'Session records: hash of the refresh token, client type, device metadata',
            'Security records: request identifier, error and access logs',
          ]},
          {note:'On sign-in code requests your IP address is stored only as a hash, never in the clear.'},
        ]},
        {id:'kaynak',heading:'Where information comes from',blocks:[
          {p:'Most of it comes directly from you. If you choose Google sign-in, your identifier and email arrive through Google Identity Services. Store information (name, address, location) largely comes from Google Places and is not your personal data.'},
        ]},
        {id:'paylasim',heading:'Who it is shared with',blocks:[
          {table:{head:['Recipient','What is sent'],rows:[
            ['Google Places','Search text, coordinates, search radius'],
            ['Google Identity Services','Authentication data, if you choose Google sign-in'],
            ['Google (Gmail API)','Your email address and the content of the message sent'],
            ['Cloud storage','Images you upload'],
            ['OpenAI','Only your search text and language preference'],
          ]}},
          {p:'These services may operate servers outside Türkiye. Your data is never shared or sold for advertising or marketing purposes.'},
        ]},
        {id:'saklama',heading:'Retention and deletion',blocks:[
          {p:'Search records are kept 365 days, search location 30 days, visitor sessions 180 days, email verification codes 30 days, session and visit-verification records 30 days after they expire, and sent-email records 90 days.'},
          {p:'Your reviews, comments, favourites and images are kept until you delete them or close your account.'},
          {p:'What is deleted, what is anonymised, and why your email address is kept is set out item by item on the account deletion page.'},
        ]},
        {id:'guvenlik',heading:'Security',blocks:[
          {p:'Tokens and notification keys are stored as hashes, never in the clear. Sign-in tokens are short-lived. The browser never connects directly to the application server; every request passes through our own server.'},
          {p:'No system is completely secure. Nothing on this page should be read as a promise of absolute security.'},
        ]},
        {id:'cocuk',heading:'Children',blocks:[
          {p:`This platform is not designed for people under ${legalFacts.minimumAge}. If we learn of an account belonging to someone below that age, we close it.`},
        ]},
        {id:'haklar',heading:'Your rights',blocks:[
          {p:`You have the right to access, correct and delete your personal data and to withdraw consent. Write to ${mail} or follow the route on the KVKK application page.`},
        ]},
        {id:'degisiklik',heading:'Changes',blocks:[
          {p:'When this policy is updated, the version number and date at the top of the page change. Significant changes are announced on the platform.'},
        ]},
      ],
    },
    de:{
      title:'Datenschutzerklärung',
      summary:`Diese Seite erklärt in einfacher Sprache, was Boşa Gezme! erhebt, wohin es geht und wie lange es gespeichert wird. Verantwortlicher ist ${controller}. Die tätigkeitsbezogene Aufschlüsselung der Rechtsgrundlagen steht im KVKK-Informationstext.`,
      sections:[
        {id:'ozet',heading:'Kurzüberblick',blocks:[
          {ul:[
            'Es findet kein Werbe- oder Analyse-Tracking statt. Weder Google Analytics noch Werbepixel oder ähnliche Werkzeuge werden eingesetzt.',
            'Dein Suchstandort wird vor der Speicherung vergröbert und nach 30 Tagen gelöscht.',
            'Bei der Besuchsbestätigung werden keinerlei Koordinaten gespeichert, nur die Entfernung zum Geschäft.',
            'Ein selbst gespeicherter Entdeckungsstandort wird in voller Genauigkeit gespeichert.',
            'Deine E-Mail-Adresse bleibt auch nach der Kontolöschung gespeichert, ausschließlich zur Wiedereröffnung.',
            'An den KI-Dienst gehen nur dein Suchtext und deine Sprache, nicht dein Standort oder deine Identität.',
          ]},
        ]},
        {id:'toplanan',heading:'Was erhoben wird',blocks:[
          {h3:'Was du angibst'},
          {ul:[
            'Konto: E-Mail-Adresse, Benutzername, Anzeigename, Spracheinstellung',
            'Optionales Profil: Biografie, Stadt, Profilbild',
            'Optionales privates Profil: Beziehungsstatus, Altersgruppen von Kindern, Wohnsituation, Beruf, Altersgruppe, Interessen',
            'Inhalte: Bewertungen, Noten, Kommentare, hochgeladene Bilder',
            'Interaktionen: Likes, Favoriten, Follows',
            'Rückmeldungen an uns: deine Nachricht und, falls angegeben, die E-Mail-Adresse für eine Antwort. Sie werden nicht veröffentlicht.',
          ]},
          {h3:'Was bei der Nutzung entsteht'},
          {ul:[
            'Deine Suchanfragen und die angezeigten Ergebnisse',
            'Standort (nach den drei oben genannten Verhaltensweisen)',
            'Besuchersitzungskennung beim Surfen ohne Anmeldung',
            'Sitzungsdaten: Hash des Refresh-Tokens, Client-Typ, Gerätedaten',
            'Sicherheitsprotokolle: Anfragekennung, Fehler- und Zugriffsprotokolle',
          ]},
          {note:'Bei Anfragen für einen Anmeldecode wird deine IP-Adresse nur als Hash gespeichert, nie im Klartext.'},
        ]},
        {id:'kaynak',heading:'Herkunft der Informationen',blocks:[
          {p:'Das meiste stammt unmittelbar von dir. Bei der Google-Anmeldung kommen Kennung und E-Mail über Google Identity Services. Geschäftsdaten (Name, Adresse, Standort) stammen überwiegend aus Google Places und sind keine personenbezogenen Daten von dir.'},
        ]},
        {id:'paylasim',heading:'Mit wem geteilt wird',blocks:[
          {table:{head:['Empfänger','Was übermittelt wird'],rows:[
            ['Google Places','Suchtext, Koordinaten, Suchradius'],
            ['Google Identity Services','Authentifizierungsdaten bei Google-Anmeldung'],
            ['Google (Gmail API)','Deine E-Mail-Adresse und der Inhalt der Nachricht'],
            ['Cloud-Speicher','Hochgeladene Bilder'],
            ['OpenAI','Nur dein Suchtext und deine Spracheinstellung'],
          ]}},
          {p:'Diese Dienste können Server außerhalb der Türkei betreiben. Deine Daten werden niemals zu Werbe- oder Marketingzwecken geteilt oder verkauft.'},
        ]},
        {id:'saklama',heading:'Aufbewahrung und Löschung',blocks:[
          {p:'Suchdatensätze werden 365 Tage, der Suchstandort 30 Tage, Besuchersitzungen 180 Tage, E-Mail-Bestätigungscodes 30 Tage, Sitzungs- und Besuchsbestätigungsdaten 30 Tage nach Ablauf und Datensätze gesendeter E-Mails 90 Tage aufbewahrt.'},
          {p:'Bewertungen, Kommentare, Favoriten und Bilder bleiben, bis du sie löschst oder dein Konto schließt.'},
          {p:'Was gelöscht, was anonymisiert wird und warum die E-Mail-Adresse bleibt, steht Punkt für Punkt auf der Seite zur Kontolöschung.'},
        ]},
        {id:'guvenlik',heading:'Sicherheit',blocks:[
          {p:'Token und Benachrichtigungsschlüssel werden als Hash gespeichert, nie im Klartext. Anmeldetoken sind kurzlebig. Der Browser verbindet sich nie direkt mit dem Anwendungsserver; alle Anfragen laufen über unseren eigenen Server.'},
          {p:'Kein System ist vollständig sicher. Nichts auf dieser Seite ist als Zusage absoluter Sicherheit zu verstehen.'},
        ]},
        {id:'cocuk',heading:'Kinder',blocks:[
          {p:`Diese Plattform ist nicht für Personen unter ${legalFacts.minimumAge} Jahren bestimmt. Erfahren wir von einem Konto einer jüngeren Person, schließen wir es.`},
        ]},
        {id:'haklar',heading:'Deine Rechte',blocks:[
          {p:`Du hast das Recht auf Auskunft, Berichtigung und Löschung sowie auf Widerruf deiner Einwilligung. Schreibe an ${mail} oder nutze den Weg auf der KVKK-Antragsseite.`},
        ]},
        {id:'degisiklik',heading:'Änderungen',blocks:[
          {p:'Bei Aktualisierungen ändern sich Versionsnummer und Datum am Seitenanfang. Wesentliche Änderungen kündigen wir auf der Plattform an.'},
        ]},
      ],
    },
    ru:{
      title:'Политика конфиденциальности',
      summary:`Здесь простым языком описано, что собирает Boşa Gezme!, куда это уходит и сколько хранится. Оператор данных — ${controller}. Разбор правовых оснований по видам деятельности — в уведомлении KVKK.`,
      sections:[
        {id:'ozet',heading:'Кратко',blocks:[
          {ul:[
            'Рекламного и аналитического отслеживания нет. Google Analytics, рекламные пиксели и подобные инструменты не используются.',
            'Местоположение при поиске огрубляется перед сохранением и удаляется через 30 дней.',
            'При подтверждении визита координаты не сохраняются вовсе — только расстояние до магазина.',
            'Сохранённое вами самим место поиска хранится с полной точностью.',
            'Ваш адрес почты сохраняется даже после удаления аккаунта — исключительно ради возможности его восстановить.',
            'В сервис ИИ уходят только текст запроса и язык; местоположение и личность — нет.',
          ]},
        ]},
        {id:'toplanan',heading:'Что собирается',blocks:[
          {h3:'Что предоставляете вы'},
          {ul:[
            'Аккаунт: адрес почты, имя пользователя, отображаемое имя, язык',
            'Необязательный профиль: описание, город, изображение профиля',
            'Необязательный приватный профиль: семейное положение, возрастные группы детей, жильё, профессия, возраст, интересы',
            'Контент: отзывы, оценки, комментарии, загруженные изображения',
            'Взаимодействия: лайки, избранное, подписки',
            'Отзывы, отправленные нам: ваше сообщение и, если вы его указали, адрес эл. почты для ответа. Они не публикуются.',
          ]},
          {h3:'Что возникает при использовании'},
          {ul:[
            'Ваши поисковые запросы и показанные результаты',
            'Местоположение (по трём описанным выше сценариям)',
            'Идентификатор сессии посетителя при просмотре без входа',
            'Данные сессий: хеш токена обновления, тип клиента, данные устройства',
            'Журналы безопасности: идентификатор запроса, журналы ошибок и доступа',
          ]},
          {note:'При запросе кода входа ваш IP-адрес сохраняется только в виде хеша, никогда в открытом виде.'},
        ]},
        {id:'kaynak',heading:'Откуда поступают данные',blocks:[
          {p:'Большая часть — непосредственно от вас. При входе через Google идентификатор и почта поступают через Google Identity Services. Данные о магазинах (название, адрес, координаты) в основном из Google Places и не являются вашими персональными данными.'},
        ]},
        {id:'paylasim',heading:'Кому передаётся',blocks:[
          {table:{head:['Получатель','Что передаётся'],rows:[
            ['Google Places','Текст запроса, координаты, радиус поиска'],
            ['Google Identity Services','Данные аутентификации при входе через Google'],
            ['Google (Gmail API)','Ваш адрес почты и содержание отправляемого письма'],
            ['Облачное хранилище','Загруженные изображения'],
            ['OpenAI','Только текст запроса и языковая настройка'],
          ]}},
          {p:'Серверы этих сервисов могут находиться за пределами Турции. Ваши данные никогда не передаются и не продаются для рекламы или маркетинга.'},
        ]},
        {id:'saklama',heading:'Хранение и удаление',blocks:[
          {p:'Записи поиска хранятся 365 дней, местоположение в поиске — 30 дней, сессии посетителей — 180 дней, коды подтверждения — 30 дней, записи сессий и подтверждений визитов — 30 дней после истечения, записи отправленных писем — 90 дней.'},
          {p:'Отзывы, комментарии, избранное и изображения хранятся, пока вы их не удалите или не закроете аккаунт.'},
          {p:'Что удаляется, что обезличивается и почему сохраняется адрес почты — по пунктам на странице удаления аккаунта.'},
        ]},
        {id:'guvenlik',heading:'Безопасность',blocks:[
          {p:'Токены и ключи уведомлений хранятся в виде хешей, не в открытом виде. Токены входа краткосрочны. Браузер никогда не обращается к серверу приложения напрямую: все запросы идут через наш сервер.'},
          {p:'Ни одна система не является полностью защищённой. Ничто на этой странице не следует понимать как обещание абсолютной безопасности.'},
        ]},
        {id:'cocuk',heading:'Дети',blocks:[
          {p:`Платформа не предназначена для лиц младше ${legalFacts.minimumAge} лет. Если нам станет известно об аккаунте такого пользователя, мы его закроем.`},
        ]},
        {id:'haklar',heading:'Ваши права',blocks:[
          {p:`Вы вправе получить доступ к своим данным, исправить и удалить их, а также отозвать согласие. Напишите на ${mail} или воспользуйтесь порядком на странице обращения KVKK.`},
        ]},
        {id:'degisiklik',heading:'Изменения',blocks:[
          {p:'При обновлении политики меняются номер версии и дата вверху страницы. О существенных изменениях сообщается на платформе.'},
        ]},
      ],
    },
  },
};

import {legalFacts} from '@/lib/legal-facts';
import type {LegalDoc} from './types';

const controller=legalFacts.legalEntityName??'';
const mail=legalFacts.supportEmail??'';
const age=legalFacts.minimumAge??16;

// The four cookies below are the complete set. There is no analytics or advertising
// cookie anywhere in the codebase, so this policy lists none -- inventing a "we may use
// analytics cookies" line to look thorough would be a false statement about the product.
export const cookies:LegalDoc={
  slug:'cookies',
  version:'1.0',effective:'2026-08-19',updated:'2026-08-19',requiresEntity:true,
  content:{
    tr:{title:'Çerez Politikası',
      summary:'Bu platformda dört çerez kullanılıyor. Üçü oturumun çalışması için zorunlu, biri dil tercihinizi hatırlıyor. Reklam veya analitik çerezi bulunmuyor.',
      sections:[
        {id:'liste',heading:'Kullanılan çerezler',blocks:[
          {table:{head:['Çerez','Taraf','Amaç','Kategori','Süre'],rows:[
            ['bosagezme_access','Birinci taraf','Oturum jetonu','Zorunlu','Oturum süresi'],
            ['bosagezme_refresh','Birinci taraf','Oturumun yenilenmesi','Zorunlu','30 gün'],
            ['bosagezme_visitor','Birinci taraf','Giriş yapmadan gezerken oturum kimliği','Zorunlu','180 güne kadar'],
            ['bosagezme_locale','Birinci taraf','Dil tercihiniz','Tercih','1 yıl'],
          ]}},
          {p:'Zorunlu çerezler oturumun ve güvenliğin çalışması için gereklidir; bunlar kapatılamaz. Dil çerezi tercihinizi hatırlar ve dilediğiniz zaman dili değiştirerek güncelleyebilirsiniz.'},
        ]},
        {id:'yok',heading:'Kullanılmayanlar',blocks:[
          {p:'Reklam çerezi, analitik çerezi, üçüncü taraf takip pikseli veya profil çıkarma amaçlı çerez kullanılmıyor. Google Analytics, Tag Manager, Meta pikseli ve benzeri araçlar bu üründe bulunmuyor.'},
          {note:'Bu durum değişir ve zorunlu olmayan çerez eklenirse, politikayı güncellemekle yetinmeyip gerçek bir onay mekanizması eklenecektir. Bir politika metni tek başına onay yerine geçmez.'},
        ]},
        {id:'depolama',heading:'Tarayıcı depolaması',blocks:[
          {p:'Çerezlere ek olarak, cihazınızdan alınan son konum tarayıcınızın yerel depolamasında, arama sonuçlarınızın anlık görüntüsü ise oturum depolamasında tutulur. Bunlar tarayıcınızdan çıkmaz; tarayıcı verilerini temizleyerek kaldırabilirsiniz.'},
        ]},
      ]},
    en:{title:'Cookie Policy',
      summary:'Four cookies are used on this platform. Three are strictly necessary for the session, one remembers your language. There are no advertising or analytics cookies.',
      sections:[
        {id:'liste',heading:'Cookies in use',blocks:[
          {table:{head:['Cookie','Party','Purpose','Category','Duration'],rows:[
            ['bosagezme_access','First party','Session token','Strictly necessary','Session'],
            ['bosagezme_refresh','First party','Renewing the session','Strictly necessary','30 days'],
            ['bosagezme_visitor','First party','Session identifier while browsing signed out','Strictly necessary','Up to 180 days'],
            ['bosagezme_locale','First party','Your language preference','Preference','1 year'],
          ]}},
          {p:'The strictly necessary cookies are required for the session and for security and cannot be turned off. The language cookie remembers your preference and updates whenever you change language.'},
        ]},
        {id:'yok',heading:'What is not used',blocks:[
          {p:'No advertising cookie, analytics cookie, third-party tracking pixel or profiling cookie is used. Google Analytics, Tag Manager, the Meta pixel and similar tools do not appear in this product.'},
          {note:'If that changes and a non-essential cookie is added, we will add a real consent mechanism rather than merely updating this policy. A policy text is not a substitute for consent.'},
        ]},
        {id:'depolama',heading:'Browser storage',blocks:[
          {p:'In addition to cookies, the last location taken from your device is kept in your browser’s local storage, and a snapshot of your search results in session storage. Neither leaves your browser, and clearing your browser data removes them.'},
        ]},
      ]},
    de:{title:'Cookie-Richtlinie',
      summary:'Auf dieser Plattform werden vier Cookies verwendet. Drei sind für die Sitzung unbedingt erforderlich, eines merkt sich deine Sprache. Werbe- oder Analyse-Cookies gibt es nicht.',
      sections:[
        {id:'liste',heading:'Verwendete Cookies',blocks:[
          {table:{head:['Cookie','Partei','Zweck','Kategorie','Dauer'],rows:[
            ['bosagezme_access','Erstanbieter','Sitzungstoken','Unbedingt erforderlich','Sitzung'],
            ['bosagezme_refresh','Erstanbieter','Erneuerung der Sitzung','Unbedingt erforderlich','30 Tage'],
            ['bosagezme_visitor','Erstanbieter','Sitzungskennung ohne Anmeldung','Unbedingt erforderlich','Bis zu 180 Tage'],
            ['bosagezme_locale','Erstanbieter','Deine Spracheinstellung','Präferenz','1 Jahr'],
          ]}},
          {p:'Die unbedingt erforderlichen Cookies werden für Sitzung und Sicherheit benötigt und lassen sich nicht abschalten. Das Sprach-Cookie merkt sich deine Auswahl.'},
        ]},
        {id:'yok',heading:'Was nicht verwendet wird',blocks:[
          {p:'Es werden keine Werbe-Cookies, Analyse-Cookies, Tracking-Pixel Dritter oder Profiling-Cookies eingesetzt. Google Analytics, Tag Manager, das Meta-Pixel und Vergleichbares kommen in diesem Produkt nicht vor.'},
          {note:'Sollte sich das ändern und ein nicht notwendiges Cookie hinzukommen, führen wir einen echten Einwilligungsmechanismus ein und aktualisieren nicht nur diesen Text. Eine Richtlinie ersetzt keine Einwilligung.'},
        ]},
        {id:'depolama',heading:'Browser-Speicher',blocks:[
          {p:'Zusätzlich werden die zuletzt vom Gerät ermittelte Position im lokalen Speicher und eine Momentaufnahme deiner Suchergebnisse im Sitzungsspeicher abgelegt. Beides verlässt den Browser nicht.'},
        ]},
      ]},
    ru:{title:'Политика cookie',
      summary:'На платформе используются четыре cookie. Три строго необходимы для сессии, один запоминает язык. Рекламных и аналитических cookie нет.',
      sections:[
        {id:'liste',heading:'Используемые cookie',blocks:[
          {table:{head:['Cookie','Сторона','Назначение','Категория','Срок'],rows:[
            ['bosagezme_access','Первая сторона','Токен сессии','Строго необходимый','Сессия'],
            ['bosagezme_refresh','Первая сторона','Обновление сессии','Строго необходимый','30 дней'],
            ['bosagezme_visitor','Первая сторона','Идентификатор сессии без входа','Строго необходимый','До 180 дней'],
            ['bosagezme_locale','Первая сторона','Языковая настройка','Предпочтение','1 год'],
          ]}},
          {p:'Строго необходимые cookie нужны для работы сессии и безопасности и не отключаются. Языковой cookie запоминает ваш выбор.'},
        ]},
        {id:'yok',heading:'Что не используется',blocks:[
          {p:'Рекламные и аналитические cookie, сторонние пиксели отслеживания и cookie для профилирования не используются. Google Analytics, Tag Manager, пиксель Meta и подобные инструменты в продукте отсутствуют.'},
          {note:'Если это изменится и появится необязательный cookie, мы добавим реальный механизм согласия, а не просто обновим текст. Политика не заменяет согласие.'},
        ]},
        {id:'depolama',heading:'Хранилище браузера',blocks:[
          {p:'Помимо cookie, последние координаты с устройства хранятся в локальном хранилище браузера, а снимок результатов поиска — в сессионном. Ни то, ни другое не покидает браузер.'},
        ]},
      ]},
  },
};

// The application routes named here are the ones that actually work today: an email
// address that is read. No KEP address, no e-signature channel and no postal address is
// listed, because none exists yet.
export const kvkkBasvuru:LegalDoc={
  slug:'kvkk/basvuru',
  version:'1.0',effective:'2026-08-19',updated:'2026-08-19',requiresEntity:true,
  content:{
    tr:{title:'KVKK Başvuru',
      summary:`Kanun'un 11. maddesindeki haklarınızı kullanmak için ${mail} adresine yazabilirsiniz. Bu sayfa başvurunun nasıl yapılacağını ve nasıl işlediğini anlatır.`,
      sections:[
        {id:'nasil',heading:'Nasıl başvurulur',blocks:[
          {p:`Başvurunuzu ${mail} adresine gönderin. Başvurunun size ait olduğunun anlaşılabilmesi için hesabınızda kayıtlı e-posta adresinden yazmanız en pratik yoldur.`},
          {p:'Başvurunuzda şunlar bulunmalıdır: adınız ve soyadınız, talebinizin konusu ve neyin yapılmasını istediğiniz.'},
          {note:'Kimliğinizi doğrulamak için gerekenden fazla bilgi istemeyiz. Kimlik fotokopisi, T.C. kimlik numarası veya adres bilgisi göndermenize gerek yoktur; hesabınıza kayıtlı adresten yazmanız yeterlidir.'},
        ]},
        {id:'sure',heading:'Süreç',blocks:[
          {p:'Başvurunuzu en kısa sürede ve Kanun’da öngörülen süre içinde sonuçlandırırız. Talebiniz reddedilirse gerekçesini yazılı olarak bildiririz.'},
          {p:'Başvurunuz ücretsizdir. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul’un belirlediği tarifedeki ücret istenebilir.'},
          {p:'Başvurunuzun sonucundan memnun kalmazsanız Kişisel Verileri Koruma Kurulu’na şikâyette bulunabilirsiniz.'},
        ]},
        {id:'kendiniz',heading:'Başvuruya gerek olmayan işlemler',blocks:[
          {p:'Bazı haklarınızı bize yazmadan kendiniz kullanabilirsiniz: profil bilgilerinizi profil sayfanızdan düzeltebilir, arama geçmişinizi tek tek veya toptan silebilir, kaydettiğiniz konumu kaldırabilir ve hesabınızı tamamen silebilirsiniz.'},
        ]},
      ]},
    en:{title:'KVKK Application',
      summary:`To exercise your rights under article 11 of the Law, write to ${mail}. This page explains how to apply and how the process works.`,
      sections:[
        {id:'nasil',heading:'How to apply',blocks:[
          {p:`Send your application to ${mail}. Writing from the email address registered on your account is the simplest way for us to see that the application is yours.`},
          {p:'Your application should include your name, the subject of your request, and what you would like done.'},
          {note:'We do not ask for more information than is needed to identify you. You do not need to send an identity document, a national identity number or an address; writing from your registered address is enough.'},
        ]},
        {id:'sure',heading:'The process',blocks:[
          {p:'We conclude applications as soon as possible and within the period the Law provides. If a request is refused, we give the reason in writing.'},
          {p:'Applying is free. Where the action itself carries a cost, the fee in the tariff set by the Board may be charged.'},
          {p:'If you are not satisfied with the outcome, you may complain to the Personal Data Protection Board.'},
        ]},
        {id:'kendiniz',heading:'Things you can do without applying',blocks:[
          {p:'You can exercise some rights yourself: correct your profile details on your profile page, delete search history individually or all at once, remove your saved location, and delete your account entirely.'},
        ]},
      ]},
    de:{title:'KVKK-Antrag',
      summary:`Zur Ausübung deiner Rechte nach Artikel 11 schreibe an ${mail}. Diese Seite erklärt Antragsweg und Ablauf.`,
      sections:[
        {id:'nasil',heading:'So beantragst du',blocks:[
          {p:`Sende deinen Antrag an ${mail}. Am einfachsten ist es, von der in deinem Konto hinterlegten E-Mail-Adresse zu schreiben.`},
          {p:'Der Antrag sollte deinen Namen, den Gegenstand deines Anliegens und dein gewünschtes Ergebnis enthalten.'},
          {note:'Wir verlangen nicht mehr Angaben als zur Identifizierung nötig. Ausweiskopie, Identitätsnummer oder Anschrift sind nicht erforderlich.'},
        ]},
        {id:'sure',heading:'Ablauf',blocks:[
          {p:'Wir bearbeiten Anträge so schnell wie möglich und innerhalb der gesetzlichen Frist. Bei Ablehnung nennen wir die Gründe schriftlich.'},
          {p:'Der Antrag ist kostenlos. Verursacht die Maßnahme selbst Kosten, kann die vom Ausschuss festgelegte Gebühr anfallen.'},
          {p:'Bist du mit dem Ergebnis nicht einverstanden, kannst du dich an den Ausschuss zum Schutz personenbezogener Daten wenden.'},
        ]},
        {id:'kendiniz',heading:'Was du ohne Antrag selbst erledigen kannst',blocks:[
          {p:'Profilangaben kannst du auf deiner Profilseite korrigieren, den Suchverlauf einzeln oder vollständig löschen, den gespeicherten Standort entfernen und dein Konto vollständig löschen.'},
        ]},
      ]},
    ru:{title:'Обращение по KVKK',
      summary:`Для реализации прав по статье 11 Закона напишите на ${mail}. Здесь описан порядок подачи и рассмотрения.`,
      sections:[
        {id:'nasil',heading:'Как подать',blocks:[
          {p:`Отправьте обращение на ${mail}. Проще всего писать с адреса, указанного в вашем аккаунте.`},
          {p:'В обращении укажите имя, суть запроса и желаемый результат.'},
          {note:'Мы не запрашиваем больше данных, чем нужно для идентификации. Копия документа, идентификационный номер или адрес не требуются.'},
        ]},
        {id:'sure',heading:'Процесс',blocks:[
          {p:'Мы рассматриваем обращения в кратчайший срок и в пределах установленного Законом периода. При отказе сообщаем причины письменно.'},
          {p:'Обращение бесплатно. Если само действие требует затрат, может взиматься плата по тарифу, установленному Советом.'},
          {p:'Если результат вас не устроит, вы можете подать жалобу в Совет по защите персональных данных.'},
        ]},
        {id:'kendiniz',heading:'Что можно сделать без обращения',blocks:[
          {p:'Данные профиля можно исправить на странице профиля, историю поиска — удалить по одной или полностью, сохранённое место — убрать, а аккаунт — удалить целиком.'},
        ]},
      ]},
  },
};

// Written to describe only what actually happens: a person reads the mailbox and decides.
// No automated detection, no formal appeal, no service-level promise -- because none of
// those exist, and describing them would be describing a different product.
export const reportContent:LegalDoc={
  slug:'report-content',
  version:'1.0',effective:'2026-08-19',updated:'2026-08-19',requiresEntity:true,
  content:{
    tr:{title:'İçerik bildirimi',
      summary:`Kurallara aykırı bir değerlendirme, yorum veya görsel gördüyseniz ${mail} adresine bildirin. Bildirimler elle değerlendirilir.`,
      sections:[
        {id:'nasil',heading:'Nasıl bildirilir',blocks:[
          {p:`${mail} adresine yazın ve şunları ekleyin: bildirdiğiniz içeriğin bağlantısı, sorunun ne olduğu ve varsa kısa bir açıklama. Bağlantı olmadan içeriği bulmamız zorlaşır.`},
        ]},
        {id:'neler',heading:'Neler bildirilebilir',blocks:[
          {ul:[
            'Ziyaret edilmemiş bir mağaza hakkında yazılmış değerlendirme',
            'Sahte, yanıltıcı veya karşılığında menfaat sağlanmış değerlendirme',
            'Bir mağazanın puanını toplu hareketle yükseltme veya düşürme girişimi',
            'Hakaret, taciz, tehdit, nefret söylemi',
            'Cinsel veya hukuka aykırı içerik',
            'Başkasının kişisel bilgilerinin izinsiz paylaşılması',
            'Reklam veya spam',
            'Hakkı size ait bir görselin izinsiz kullanılması',
            'Başkasının kimliğine bürünme',
          ]},
        ]},
        {id:'sonra',heading:'Bildirimden sonra ne oluyor',blocks:[
          {p:'Bildirimi okur, içeriği kurallar açısından değerlendirir ve gerekliyse içeriği kaldırır veya hesaba kısıtlama uygularız.'},
          {note:'Şu anda otomatik içerik denetim sistemi ve resmî bir itiraz süreci bulunmamaktadır. Bildirimlerin ne kadar sürede sonuçlanacağına dair bir taahhüt veremeyiz. Bunlar geliştirildiğinde bu sayfa güncellenecektir.'},
          {p:'Bir içeriğin kaldırılmamış olması, incelenip uygun bulunduğu anlamına gelmeyebilir. Kararımıza katılmıyorsanız aynı adrese tekrar yazabilirsiniz.'},
        ]},
        {id:'hukuki',heading:'Hukuki talepler ve telif',blocks:[
          {p:`Telif veya marka hakkı ihlali, mahkeme kararı ya da resmî bir talep söz konusuysa aynı adrese (${mail}) yazın ve talebin hukuki dayanağını belirtin.`},
        ]},
      ]},
    en:{title:'Reporting content',
      summary:`If you have seen a review, comment or image that breaks the rules, report it to ${mail}. Reports are reviewed by hand.`,
      sections:[
        {id:'nasil',heading:'How to report',blocks:[
          {p:`Write to ${mail} and include the link to the content, what the problem is, and a short explanation if it helps. Without a link it is hard for us to find the content.`},
        ]},
        {id:'neler',heading:'What can be reported',blocks:[
          {ul:[
            'A review of a store the writer did not visit',
            'Fake or misleading reviews, or reviews given in exchange for a benefit',
            'Coordinated attempts to raise or lower a store’s rating',
            'Insults, harassment, threats, hate speech',
            'Sexual or unlawful content',
            'Someone else’s personal information shared without permission',
            'Advertising or spam',
            'Use of an image you hold the rights to, without permission',
            'Impersonation',
          ]},
        ]},
        {id:'sonra',heading:'What happens next',blocks:[
          {p:'We read the report, assess the content against the rules, and where necessary remove it or restrict the account.'},
          {note:'There is currently no automated moderation system and no formal appeals process, and we cannot promise how long a report will take. This page will be updated when those exist.'},
          {p:'Content that has not been removed has not necessarily been reviewed and approved. If you disagree with our decision, you can write to the same address again.'},
        ]},
        {id:'hukuki',heading:'Legal requests and copyright',blocks:[
          {p:`For copyright or trade mark infringement, a court order or an official request, write to the same address (${mail}) and state the legal basis of the request.`},
        ]},
      ]},
    de:{title:'Inhalte melden',
      summary:`Wenn du eine regelwidrige Bewertung, einen Kommentar oder ein Bild gesehen hast, melde es an ${mail}. Meldungen werden manuell geprüft.`,
      sections:[
        {id:'nasil',heading:'So meldest du',blocks:[
          {p:`Schreibe an ${mail} und füge den Link zum Inhalt, die Art des Problems und ggf. eine kurze Erläuterung bei. Ohne Link ist der Inhalt schwer auffindbar.`},
        ]},
        {id:'neler',heading:'Was gemeldet werden kann',blocks:[
          {ul:[
            'Bewertung eines Geschäfts, das die schreibende Person nicht besucht hat',
            'Gefälschte, irreführende oder gegen einen Vorteil verfasste Bewertungen',
            'Koordinierte Versuche, eine Bewertung anzuheben oder zu senken',
            'Beleidigung, Belästigung, Drohung, Hassrede',
            'Sexuelle oder rechtswidrige Inhalte',
            'Ohne Erlaubnis geteilte personenbezogene Daten Dritter',
            'Werbung oder Spam',
            'Unerlaubte Nutzung eines Bildes, an dem du Rechte hältst',
            'Identitätsvortäuschung',
          ]},
        ]},
        {id:'sonra',heading:'Was danach passiert',blocks:[
          {p:'Wir lesen die Meldung, prüfen den Inhalt anhand der Regeln und entfernen ihn erforderlichenfalls oder schränken das Konto ein.'},
          {note:'Derzeit gibt es kein automatisiertes Moderationssystem und kein förmliches Beschwerdeverfahren; eine Bearbeitungsdauer können wir nicht zusagen. Diese Seite wird aktualisiert, sobald es sie gibt.'},
          {p:'Nicht entfernte Inhalte sind nicht zwingend geprüft und gebilligt. Bist du mit der Entscheidung nicht einverstanden, schreibe erneut an dieselbe Adresse.'},
        ]},
        {id:'hukuki',heading:'Rechtliche Anfragen und Urheberrecht',blocks:[
          {p:`Für Urheber- oder Markenrechtsverletzungen, gerichtliche Anordnungen oder behördliche Anfragen schreibe an dieselbe Adresse (${mail}) und nenne die Rechtsgrundlage.`},
        ]},
      ]},
    ru:{title:'Жалоба на контент',
      summary:`Если вы увидели отзыв, комментарий или изображение, нарушающие правила, сообщите на ${mail}. Обращения рассматриваются вручную.`,
      sections:[
        {id:'nasil',heading:'Как сообщить',blocks:[
          {p:`Напишите на ${mail} и приложите ссылку на контент, суть проблемы и краткое пояснение. Без ссылки найти контент сложно.`},
        ]},
        {id:'neler',heading:'О чём можно сообщить',blocks:[
          {ul:[
            'Отзыв о магазине, который автор не посещал',
            'Поддельные, вводящие в заблуждение или оплаченные отзывы',
            'Согласованные попытки повысить или понизить рейтинг',
            'Оскорбления, преследование, угрозы, разжигание ненависти',
            'Материалы сексуального характера или незаконный контент',
            'Персональные данные других лиц без разрешения',
            'Реклама или спам',
            'Использование изображения, права на которое принадлежат вам, без разрешения',
            'Выдача себя за другого',
          ]},
        ]},
        {id:'sonra',heading:'Что происходит дальше',blocks:[
          {p:'Мы читаем обращение, оцениваем контент по правилам и при необходимости удаляем его или ограничиваем аккаунт.'},
          {note:'Сейчас нет ни автоматической модерации, ни формальной процедуры обжалования, и мы не можем обещать срок рассмотрения. Страница будет обновлена, когда они появятся.'},
          {p:'Неудалённый контент не обязательно был рассмотрен и одобрен. Если вы не согласны с решением, напишите на тот же адрес повторно.'},
        ]},
        {id:'hukuki',heading:'Правовые запросы и авторское право',blocks:[
          {p:`По вопросам нарушения авторских или товарных прав, судебных решений и официальных запросов пишите на тот же адрес (${mail}), указав правовое основание.`},
        ]},
      ]},
  },
};

export const contact:LegalDoc={
  slug:'contact',
  version:'1.0',effective:'2026-08-19',updated:'2026-08-19',requiresEntity:true,
  content:{
    tr:{title:'İletişim',
      summary:`Her konu için tek bir adres kullanıyoruz: ${mail}. Konuyu e-postanın başlığına yazarsanız daha hızlı ilerler.`,
      sections:[
        {id:'kanallar',heading:'Hangi konu için ne yazmalı',blocks:[
          {table:{head:['Konu','E-posta konusu olarak yazın'],rows:[
            ['Genel destek ve sorular','Destek'],
            ['Gizlilik ve KVKK başvurusu','KVKK'],
            ['Hukuki bildirim','Hukuki'],
            ['İçerik şikayeti','İçerik bildirimi'],
            ['Telif veya marka ihlali','Fikri mülkiyet'],
            ['Güvenlik açığı bildirimi','Güvenlik'],
            ['Mağaza bilgisi düzeltme','Mağaza düzeltme'],
          ]}},
          {p:`Adres: ${mail}`},
        ]},
        {id:'sorumlu',heading:'Sorumlu',blocks:[
          {p:`Platformu işleten ve veri sorumlusu sıfatını taşıyan kişi: ${controller}${legalFacts.controllerWebsite?` (${legalFacts.controllerWebsite})`:''}.`},
        ]},
      ]},
    en:{title:'Contact',
      summary:`We use a single address for everything: ${mail}. Putting the subject in the email subject line moves things along faster.`,
      sections:[
        {id:'kanallar',heading:'What to write for which subject',blocks:[
          {table:{head:['Subject','Write as the email subject'],rows:[
            ['General support and questions','Support'],
            ['Privacy and KVKK applications','KVKK'],
            ['Legal notices','Legal'],
            ['Content reports','Content report'],
            ['Copyright or trade mark infringement','Intellectual property'],
            ['Security vulnerability reports','Security'],
            ['Store information corrections','Store correction'],
          ]}},
          {p:`Address: ${mail}`},
        ]},
        {id:'sorumlu',heading:'Who is responsible',blocks:[
          {p:`The person operating the platform and acting as data controller: ${controller}${legalFacts.controllerWebsite?` (${legalFacts.controllerWebsite})`:''}.`},
        ]},
      ]},
    de:{title:'Kontakt',
      summary:`Wir nutzen eine einzige Adresse für alles: ${mail}. Schreibe das Thema in die Betreffzeile, dann geht es schneller.`,
      sections:[
        {id:'kanallar',heading:'Welches Thema, welcher Betreff',blocks:[
          {table:{head:['Thema','Als Betreff schreiben'],rows:[
            ['Allgemeiner Support und Fragen','Support'],
            ['Datenschutz und KVKK-Anträge','KVKK'],
            ['Rechtliche Mitteilungen','Rechtliches'],
            ['Inhaltsmeldungen','Inhaltsmeldung'],
            ['Urheber- oder Markenrechtsverletzung','Geistiges Eigentum'],
            ['Meldung von Sicherheitslücken','Sicherheit'],
            ['Korrektur von Geschäftsdaten','Geschäftskorrektur'],
          ]}},
          {p:`Adresse: ${mail}`},
        ]},
        {id:'sorumlu',heading:'Verantwortlich',blocks:[
          {p:`Betreiber der Plattform und Verantwortlicher: ${controller}${legalFacts.controllerWebsite?` (${legalFacts.controllerWebsite})`:''}.`},
        ]},
      ]},
    ru:{title:'Контакты',
      summary:`Для всех вопросов используется один адрес: ${mail}. Укажите тему в теме письма — так быстрее.`,
      sections:[
        {id:'kanallar',heading:'Какая тема для какого вопроса',blocks:[
          {table:{head:['Вопрос','Тема письма'],rows:[
            ['Общая поддержка и вопросы','Поддержка'],
            ['Конфиденциальность и обращения KVKK','KVKK'],
            ['Правовые уведомления','Правовое'],
            ['Жалобы на контент','Жалоба на контент'],
            ['Нарушение авторских или товарных прав','Интеллектуальная собственность'],
            ['Сообщения об уязвимостях','Безопасность'],
            ['Исправление данных магазина','Исправление магазина'],
          ]}},
          {p:`Адрес: ${mail}`},
        ]},
        {id:'sorumlu',heading:'Ответственное лицо',blocks:[
          {p:`Платформой управляет и выступает оператором данных: ${controller}${legalFacts.controllerWebsite?` (${legalFacts.controllerWebsite})`:''}.`},
        ]},
      ]},
  },
};

export const childrenPrivacy:LegalDoc={
  slug:'children-privacy',
  version:'1.0',effective:'2026-08-19',updated:'2026-08-19',requiresEntity:true,
  content:{
    tr:{title:'Çocukların gizliliği',
      summary:`Bu platform ${age} yaşından küçükler için tasarlanmamıştır ve hesap açmak için en az ${age} yaşında olmak gerekir.`,
      sections:[
        {id:'yas',heading:'Yaş sınırı',blocks:[
          {p:`Hesap oluşturmak için en az ${age} yaşında olmanız gerekir. ${age} yaşından küçük olduğunu öğrendiğimiz hesapları kapatırız.`},
          {note:'Şu anda yaş doğrulaması teknik olarak yapılmamaktadır; yaş sınırı bir kural olarak uygulanır ve ihlal bildirildiğinde işlem yapılır.'},
        ]},
        {id:'neden',heading:'Neden önemli',blocks:[
          {p:'Bu platformda yazdığınız değerlendirmeler ve yüklediğiniz görseller herkese açıktır. Ayrıca arama ve ziyaret doğrulama konum bilgisi kullanır. Bu iki özellik, çocuklar için ayrıca dikkat gerektiren niteliktedir.'},
        ]},
        {id:'cocuk-verisi',heading:'Çocuklara ilişkin bilgiler',blocks:[
          {p:'İsteğe bağlı özel profil bölümünde, evinizde çocuk olup olmadığı ve çocukların yaş aralıkları sorulabilir. Bu bilgi tamamen isteğe bağlıdır, açık rızanıza dayanır ve önerileri kişiselleştirmek dışında bir amaçla kullanılmaz.'},
          {p:'Bu bilgiyi vermek zorunda değilsiniz; vermemeniz platformu kullanmanızı etkilemez. Verdikten sonra profil sayfanızdan kaldırabilirsiniz.'},
        ]},
        {id:'bildirim',heading:'Bildirim',blocks:[
          {p:`Yaş sınırının altındaki bir kişinin hesabı olduğunu düşünüyorsanız ${mail} adresine bildirin.`},
        ]},
      ]},
    en:{title:'Children’s privacy',
      summary:`This platform is not designed for people under ${age}, and you must be at least ${age} to create an account.`,
      sections:[
        {id:'yas',heading:'Age limit',blocks:[
          {p:`You must be at least ${age} to create an account. We close accounts we learn belong to someone under ${age}.`},
          {note:'There is currently no technical age verification; the age limit is applied as a rule and acted on when a breach is reported.'},
        ]},
        {id:'neden',heading:'Why it matters',blocks:[
          {p:'Reviews you write and images you upload here are public. Search and visit verification also use location. Both warrant particular care where children are concerned.'},
        ]},
        {id:'cocuk-verisi',heading:'Information about children',blocks:[
          {p:'The optional private profile section may ask whether there are children in your household and their age ranges. This is entirely optional, rests on your explicit consent, and is not used for anything other than personalising recommendations.'},
          {p:'You do not have to provide it, and not providing it does not affect your use of the platform. You can remove it from your profile page afterwards.'},
        ]},
        {id:'bildirim',heading:'Reporting',blocks:[
          {p:`If you believe someone under the age limit has an account, report it to ${mail}.`},
        ]},
      ]},
    de:{title:'Datenschutz für Kinder',
      summary:`Diese Plattform ist nicht für Personen unter ${age} Jahren bestimmt; für ein Konto musst du mindestens ${age} Jahre alt sein.`,
      sections:[
        {id:'yas',heading:'Altersgrenze',blocks:[
          {p:`Für ein Konto musst du mindestens ${age} Jahre alt sein. Konten von Personen unter ${age} schließen wir, sobald wir davon erfahren.`},
          {note:'Eine technische Altersverifikation gibt es derzeit nicht; die Grenze gilt als Regel und wird bei Meldungen durchgesetzt.'},
        ]},
        {id:'neden',heading:'Warum das wichtig ist',blocks:[
          {p:'Deine Bewertungen und hochgeladenen Bilder sind öffentlich. Suche und Besuchsbestätigung nutzen zudem den Standort. Beides erfordert bei Kindern besondere Sorgfalt.'},
        ]},
        {id:'cocuk-verisi',heading:'Angaben zu Kindern',blocks:[
          {p:'Im optionalen privaten Profil kann gefragt werden, ob Kinder im Haushalt leben und in welchen Altersgruppen. Diese Angabe ist vollständig freiwillig, beruht auf deiner ausdrücklichen Einwilligung und dient allein der Personalisierung von Empfehlungen.'},
          {p:'Du musst sie nicht machen; ohne sie kannst du die Plattform uneingeschränkt nutzen. Du kannst sie später im Profil entfernen.'},
        ]},
        {id:'bildirim',heading:'Meldung',blocks:[
          {p:`Wenn du glaubst, dass eine Person unter der Altersgrenze ein Konto hat, melde das an ${mail}.`},
        ]},
      ]},
    ru:{title:'Конфиденциальность детей',
      summary:`Платформа не предназначена для лиц младше ${age} лет; для создания аккаунта нужно быть не младше ${age}.`,
      sections:[
        {id:'yas',heading:'Возрастное ограничение',blocks:[
          {p:`Для создания аккаунта нужно быть не младше ${age} лет. Аккаунты лиц младше ${age}, о которых нам станет известно, закрываются.`},
          {note:'Технической проверки возраста сейчас нет; ограничение применяется как правило и реализуется по обращениям.'},
        ]},
        {id:'neden',heading:'Почему это важно',blocks:[
          {p:'Ваши отзывы и загруженные изображения публичны. Поиск и подтверждение визита используют местоположение. И то и другое требует особой осторожности в отношении детей.'},
        ]},
        {id:'cocuk-verisi',heading:'Сведения о детях',blocks:[
          {p:'В необязательном приватном профиле может быть вопрос о наличии детей и их возрастных группах. Это полностью добровольно, основано на вашем явном согласии и используется только для персонализации рекомендаций.'},
          {p:'Вы не обязаны это указывать; отказ не влияет на пользование платформой. Позже эти данные можно удалить в профиле.'},
        ]},
        {id:'bildirim',heading:'Сообщение',blocks:[
          {p:`Если вы считаете, что аккаунт принадлежит лицу младше указанного возраста, сообщите на ${mail}.`},
        ]},
      ]},
  },
};

// Marketing does not exist yet, so this page says so rather than describing an opt-out for
// messages nobody sends. It exists to draw the line now: a one-time code is not marketing,
// and the day marketing starts it will need consent and an İYS record, not this page.
export const commercialCommunications:LegalDoc={
  slug:'commercial-communications',
  version:'1.0',effective:'2026-08-19',updated:'2026-08-19',requiresEntity:true,
  content:{
    tr:{title:'Ticari elektronik ileti',
      summary:'Şu anda hiçbir pazarlama e-postası veya bildirimi gönderilmiyor. Gönderilen tek e-postalar giriş kodu ve hoş geldiniz mesajıdır; bunlar ticari ileti değildir.',
      sections:[
        {id:'simdi',heading:'Bugün ne gönderiliyor',blocks:[
          {table:{head:['E-posta','Türü','Rıza gerekir mi'],rows:[
            ['Giriş için tek kullanımlık kod','İşlemsel — hizmetin işleyişi','Hayır'],
            ['Hoş geldiniz mesajı','İşlemsel — hesabın kurulması','Hayır'],
          ]}},
          {p:'Bu iki e-posta, hizmeti kullanabilmeniz için gönderilir ve pazarlama amacı taşımaz. Giriş kodu e-postası bir ticari elektronik ileti değildir ve bu şekilde tanımlanamaz.'},
        ]},
        {id:'gelecek',heading:'İleride pazarlama iletisi gönderilirse',blocks:[
          {p:'Kampanya, tanıtım veya duyuru niteliğinde ileti göndermeye başlarsak bunlar 6563 sayılı Kanun kapsamında ticari elektronik ileti sayılır. Bu durumda:'},
          {ul:[
            'Önceden onayınız alınır; hizmete erişim bu onaya bağlanmaz',
            'Onay İleti Yönetim Sistemi (İYS) üzerinden kaydedilir',
            'Her iletide kolay ve ücretsiz bir ret (opt-out) imkânı bulunur',
            'Reddettiğinizde gönderim derhal durdurulur',
          ]},
          {note:'Bu sayfa, o gün geldiğinde uyulacak kuralları şimdiden yazar. Bugün gönderilen bir pazarlama iletisi yoktur.'},
        ]},
      ]},
    en:{title:'Commercial electronic messages',
      summary:'No marketing email or notification is sent at present. The only emails sent are the sign-in code and a welcome message, and neither is a commercial message.',
      sections:[
        {id:'simdi',heading:'What is sent today',blocks:[
          {table:{head:['Email','Type','Consent needed'],rows:[
            ['One-time sign-in code','Transactional — operation of the service','No'],
            ['Welcome message','Transactional — account creation','No'],
          ]}},
          {p:'Both are sent so that you can use the service and carry no marketing purpose. A sign-in code email is not a commercial electronic message and cannot be described as one.'},
        ]},
        {id:'gelecek',heading:'If marketing messages are sent in future',blocks:[
          {p:'If we begin sending campaign, promotional or announcement messages, those count as commercial electronic messages under Law No. 6563. In that case:'},
          {ul:[
            'Your consent will be obtained beforehand, and access to the service will not depend on it',
            'Consent will be recorded through the Message Management System (İYS)',
            'Every message will carry an easy, free opt-out',
            'Sending stops immediately once you opt out',
          ]},
          {note:'This page sets out the rules that will apply when that day comes. No marketing message is sent today.'},
        ]},
      ]},
    de:{title:'Kommerzielle elektronische Nachrichten',
      summary:'Derzeit werden keine Marketing-E-Mails oder -Benachrichtigungen versendet. Versendet werden nur der Anmeldecode und eine Willkommensnachricht; beides sind keine kommerziellen Nachrichten.',
      sections:[
        {id:'simdi',heading:'Was heute versendet wird',blocks:[
          {table:{head:['E-Mail','Art','Einwilligung nötig'],rows:[
            ['Einmaliger Anmeldecode','Transaktional — Betrieb des Dienstes','Nein'],
            ['Willkommensnachricht','Transaktional — Kontoerstellung','Nein'],
          ]}},
          {p:'Beide werden versendet, damit du den Dienst nutzen kannst, und verfolgen keinen Werbezweck. Eine Anmeldecode-E-Mail ist keine kommerzielle elektronische Nachricht.'},
        ]},
        {id:'gelecek',heading:'Falls künftig Marketingnachrichten versendet werden',blocks:[
          {p:'Beginnen wir mit Kampagnen-, Werbe- oder Ankündigungsnachrichten, gelten diese als kommerzielle elektronische Nachrichten nach dem Gesetz Nr. 6563. Dann gilt:'},
          {ul:[
            'Deine Einwilligung wird vorab eingeholt; der Zugang zum Dienst hängt nicht davon ab',
            'Die Einwilligung wird über das Nachrichtenverwaltungssystem (İYS) erfasst',
            'Jede Nachricht enthält eine einfache, kostenlose Abmeldemöglichkeit',
            'Nach der Abmeldung wird der Versand sofort eingestellt',
          ]},
          {note:'Diese Seite hält die künftig geltenden Regeln bereits fest. Heute wird keine Marketingnachricht versendet.'},
        ]},
      ]},
    ru:{title:'Коммерческие электронные сообщения',
      summary:'Маркетинговые письма и уведомления сейчас не отправляются. Отправляются только код входа и приветственное письмо — ни то, ни другое не является коммерческим сообщением.',
      sections:[
        {id:'simdi',heading:'Что отправляется сегодня',blocks:[
          {table:{head:['Письмо','Тип','Нужно согласие'],rows:[
            ['Одноразовый код входа','Транзакционное — работа сервиса','Нет'],
            ['Приветственное письмо','Транзакционное — создание аккаунта','Нет'],
          ]}},
          {p:'Оба письма нужны для пользования сервисом и не имеют маркетинговой цели. Письмо с кодом входа не является коммерческим электронным сообщением.'},
        ]},
        {id:'gelecek',heading:'Если в будущем появятся маркетинговые сообщения',blocks:[
          {p:'Если мы начнём рассылать рекламные, акционные или анонсирующие сообщения, они будут считаться коммерческими электронными сообщениями по Закону № 6563. В этом случае:'},
          {ul:[
            'Согласие будет получено заранее, и доступ к сервису не будет от него зависеть',
            'Согласие будет зафиксировано через Систему управления сообщениями (İYS)',
            'В каждом сообщении будет простой и бесплатный отказ от рассылки',
            'После отказа рассылка прекращается немедленно',
          ]},
          {note:'Эта страница заранее фиксирует правила на тот момент. Сегодня маркетинговые сообщения не отправляются.'},
        ]},
      ]},
  },
};

import type {LegalDoc} from './types';

// Every statement here was checked against the backend rather than described from how a
// discovery product usually behaves. Three location behaviours exist and they differ, so
// the page describes three, not one:
//
//   1. searches.request_latitude/longitude  -- rounded, SEARCH_LOCATION_DECIMALS default 3
//   2. store_visit_verifications            -- no coordinates at all, distance + accuracy
//   3. user_private_profiles.discovery_location -- full precision geography(Point,4326)
//
// Because of (3) this page must never say that precise coordinates are not stored. It
// also states that coordinates are not sent to OpenAI, which is true only because
// intentPrompt() interpolates the query and locale alone; if that prompt changes, this
// document changes with it.
export const locationPrivacy:LegalDoc={
  slug:'location-privacy',
  version:'1.0',
  effective:'2026-08-18',
  updated:'2026-08-18',
  requiresEntity:false,
  content:{
    tr:{
      title:'Konum gizliliği',
      summary:'Konum bu ürünün merkezinde. Bu sayfa konumunuzun ne zaman istendiğini, hangi hassasiyetle işlendiğini, neyin saklanıp neyin hiç saklanmadığını anlatır. Üç farklı davranış var ve birbirinden farklılar.',
      sections:[
        {id:'ne-zaman',heading:'Konum ne zaman isteniyor',blocks:[
          {p:'Konum izni yalnızca iki yerde istenir: bir arama yaparken ve bir mağaza için değerlendirme yazmadan önce ziyaretinizi doğrularken. Gezinirken, akışa bakarken veya bir mağaza sayfasını okurken konum istenmez.'},
          {p:'İzin vermezseniz mağaza sayfalarını okumaya ve akışı görmeye devam edebilirsiniz. Arama, sonuçları yakından uzağa sıralayabilmek için bir konum gerektirir; bunu cihazınızdan almak yerine listeden bir yer seçerek de verebilirsiniz.'},
        ]},
        {id:'arama',heading:'Arama konumu',blocks:[
          {p:'Bir arama yaptığınızda koordinatlarınız sonuçları mesafeye göre sıralamak için kullanılır. Aramanın kaydına yazılırken koordinatlar kasıtlı olarak kabalaştırılır: varsayılan ayar üç ondalık basamaktır, bu da yaklaşık 110 metrelik bir alana karşılık gelir. Bulunduğunuz bina değil, bulunduğunuz semt saklanır.'},
          {p:'Kabalaştırılmış bu koordinatlar da kalıcı değildir. Arama kayıtlarındaki koordinat alanları 30 gün sonra boşaltılır; aramanın kendisi (yazdığınız metin ve sonuç sayısı) 365 güne kadar saklanır.'},
          {note:'Bu süreler koddaki bakım işinde tanımlıdır. İşin canlı ortamda hangi sıklıkla çalıştırıldığı ayrı bir operasyon konusudur ve bu sayfa yalnızca tanımlı davranışı anlatır.'},
        ]},
        {id:'ziyaret',heading:'Ziyaret doğrulama',blocks:[
          {p:'Bir değerlendirme yazabilmek için mağazanın yanında olduğunuzu doğrulamanız gerekir. Bu doğrulama sırasında koordinatlarınız hiçbir biçimde saklanmaz.'},
          {p:'Kaydedilen tek şey iki sayıdır: mağazaya olan mesafeniz ve cihazınızın bildirdiği doğruluk payı. Nerede olduğunuz değil, mağazaya ne kadar yakın olduğunuz saklanır. Bu kayıt 30 gün geçerlidir ve süresi dolduktan ya da bir değerlendirmede kullanıldıktan 30 gün sonra silinir.'},
        ]},
        {id:'kayitli-konum',heading:'Kaydettiğiniz keşif konumu',blocks:[
          {p:'Aramada bir konumu kendiniz seçip kaydederseniz, bu konum tam hassasiyetle saklanır. Seçtiğiniz yerin etiketi, adresi ve sağlayıcı kimliği de birlikte tutulur.'},
          {p:'Bu, yukarıdaki iki davranıştan bilinçli olarak farklıdır: her aramada size yeniden konum sormamak için, sizin kaydetmeyi seçtiğiniz bir tercihtir. Bu yüzden bu sayfa "hassas konumunuzu saklamıyoruz" demez — kaydettiğiniz konum için bu doğru olmaz.'},
          {p:'Kaydettiğiniz konumu profilinizden değiştirebilir veya kaldırabilirsiniz. Hesabınızı silerseniz bu kayıt da silinir.'},
        ]},
        {id:'ucuncu-taraf',heading:'Konumunuz kimlere gidiyor',blocks:[
          {p:'Arama sırasında sorgunuz, koordinatlarınız ve arama yarıçapı mağaza sonuçlarını getirmek için Google Places servisine iletilir.'},
          {p:'Aramanızın ne aradığını anlamak için kullanılan yapay zekâ servisine konumunuz gönderilmez. O servise yalnızca yazdığınız metin ve dil tercihiniz iletilir.'},
        ]},
        {id:'tarayici',heading:'Tarayıcınızda tutulanlar',blocks:[
          {p:'Cihazınızdan alınan son konum, arama sırasında tekrar tekrar izin istememek için tarayıcınızın yerel depolamasında tutulur. Bu bilgi tarayıcınızdan çıkmaz; tarayıcı verilerini temizleyerek kaldırabilirsiniz.'},
          {p:'Konum iznini istediğiniz zaman tarayıcınızın veya işletim sisteminizin ayarlarından geri alabilirsiniz. İzni geri almak bu ürünü kullanmanızı engellemez, yalnızca aramanın konum gerektiren kısmını etkiler.'},
        ]},
        {id:'sinirlar',heading:'Doğruluğun sınırları',blocks:[
          {p:'Konum bilgisi cihazınızdan gelir ve her zaman doğru değildir. Kapalı alanlarda, yoğun yapılaşmada veya zayıf sinyalde sapma büyür. Ziyaret doğrulaması bu nedenle cihazın bildirdiği doğruluk payını da kaydeder.'},
          {p:'Tarayıcıdan gelen konum bilgisinin kasıtlı olarak değiştirilebileceğini de belirtmek gerekir. Doğrulama, kötü niyetli kullanımı tamamen engelleyen bir kanıt değil, iyi niyetli kullanımda gerçekten orada olduğunuzu gösteren bir işarettir.'},
          {p:'Bir yere gitmeden önce mağazanın açık olduğunu ve adresin güncel olduğunu bağımsız olarak doğrulamanızı öneririz.'},
        ]},
      ],
    },
    en:{
      title:'Location privacy',
      summary:'Location is central to this product. This page explains when it is requested, at what precision it is processed, what is stored and what is never stored. There are three distinct behaviours, and they differ.',
      sections:[
        {id:'ne-zaman',heading:'When location is requested',blocks:[
          {p:'Location permission is requested in two places only: when you run a search, and when you verify your visit before writing a review. It is not requested while browsing, reading the feed, or viewing a store page.'},
          {p:'If you decline, you can still read store pages and the feed. Search needs a location so it can order results from nearest to farthest, and you can supply one by choosing a place from a list instead of using your device.'},
        ]},
        {id:'arama',heading:'Search location',blocks:[
          {p:'When you search, your coordinates order the results by distance. They are deliberately coarsened before being written to the search record: the default setting is three decimal places, roughly a 110 metre area. What is stored is your neighbourhood, not your building.'},
          {p:'Even those coarsened coordinates are not permanent. The coordinate fields on search records are emptied after 30 days; the search itself — the text you typed and the number of results — is kept for up to 365 days.'},
          {note:'These periods are defined in a maintenance job in the code. How often that job runs in production is a separate operational matter, and this page describes only the defined behaviour.'},
        ]},
        {id:'ziyaret',heading:'Visit verification',blocks:[
          {p:'To write a review you must confirm you are at the store. Your coordinates are not stored in any form during that check.'},
          {p:'Two numbers are recorded: your distance to the store, and the accuracy your device reported. What is kept is how close you were to the store, not where you were. The record is valid for 30 days and is deleted 30 days after it expires or is used for a review.'},
        ]},
        {id:'kayitli-konum',heading:'The discovery location you save',blocks:[
          {p:'If you choose and save a location in search, that location is stored at full precision, together with its label, address and provider identifier.'},
          {p:'This is deliberately different from the two behaviours above: it is a preference you chose to save so that search does not ask you for a location every time. That is why this page does not say "we do not store your precise location" — for a location you saved, that would not be true.'},
          {p:'You can change or remove the saved location from your profile. Deleting your account deletes it as well.'},
        ]},
        {id:'ucuncu-taraf',heading:'Who receives your location',blocks:[
          {p:'During a search your query, your coordinates and the search radius are sent to Google Places in order to return store results.'},
          {p:'Your location is not sent to the AI service used to interpret what your search means. That service receives only the text you typed and your language preference.'},
        ]},
        {id:'tarayici',heading:'What stays in your browser',blocks:[
          {p:'The last fix taken from your device is kept in your browser’s local storage so that search does not ask for permission repeatedly. It does not leave your browser, and clearing your browser data removes it.'},
          {p:'You can withdraw location permission at any time in your browser or operating system settings. Withdrawing it does not prevent you from using the product; it affects only the part of search that needs a location.'},
        ]},
        {id:'sinirlar',heading:'Limits of accuracy',blocks:[
          {p:'Location comes from your device and is not always correct. Indoors, among tall buildings, or on a weak signal the error grows. This is why visit verification also records the accuracy your device reported.'},
          {p:'It should also be said that browser location can be altered deliberately. Verification is a signal that you were genuinely there in good-faith use, not proof that defeats deliberate misuse.'},
          {p:'Before travelling anywhere, we recommend confirming independently that the store is open and that the address is current.'},
        ]},
      ],
    },
    de:{
      title:'Standortdatenschutz',
      summary:'Standort steht im Zentrum dieses Produkts. Diese Seite erklärt, wann er abgefragt wird, mit welcher Genauigkeit er verarbeitet wird, was gespeichert wird und was nie gespeichert wird. Es gibt drei unterschiedliche Verhaltensweisen.',
      sections:[
        {id:'ne-zaman',heading:'Wann der Standort abgefragt wird',blocks:[
          {p:'Die Standortberechtigung wird nur an zwei Stellen abgefragt: bei einer Suche und bei der Bestätigung deines Besuchs, bevor du eine Bewertung schreibst. Beim Stöbern, beim Lesen des Feeds oder auf einer Geschäftsseite wird sie nicht abgefragt.'},
          {p:'Wenn du ablehnst, kannst du Geschäftsseiten und den Feed weiterhin lesen. Die Suche benötigt einen Standort, um Ergebnisse von nah nach fern zu ordnen; du kannst ihn auch angeben, indem du einen Ort aus einer Liste wählst, statt dein Gerät zu verwenden.'},
        ]},
        {id:'arama',heading:'Suchstandort',blocks:[
          {p:'Bei einer Suche ordnen deine Koordinaten die Ergebnisse nach Entfernung. Vor dem Speichern im Suchdatensatz werden sie bewusst vergröbert: Die Voreinstellung sind drei Nachkommastellen, also etwa ein Bereich von 110 Metern. Gespeichert wird deine Gegend, nicht dein Gebäude.'},
          {p:'Auch diese vergröberten Koordinaten sind nicht dauerhaft. Die Koordinatenfelder der Suchdatensätze werden nach 30 Tagen geleert; die Suche selbst — der eingegebene Text und die Trefferzahl — wird bis zu 365 Tage aufbewahrt.'},
          {note:'Diese Fristen sind in einem Wartungsjob im Code definiert. Wie oft dieser Job im Produktivbetrieb läuft, ist eine gesonderte betriebliche Frage; diese Seite beschreibt nur das definierte Verhalten.'},
        ]},
        {id:'ziyaret',heading:'Besuchsbestätigung',blocks:[
          {p:'Um eine Bewertung zu schreiben, musst du bestätigen, dass du am Geschäft bist. Deine Koordinaten werden bei dieser Prüfung in keiner Form gespeichert.'},
          {p:'Erfasst werden zwei Zahlen: deine Entfernung zum Geschäft und die von deinem Gerät gemeldete Genauigkeit. Gespeichert wird, wie nah du am Geschäft warst, nicht wo du warst. Der Datensatz gilt 30 Tage und wird 30 Tage nach Ablauf oder Verwendung gelöscht.'},
        ]},
        {id:'kayitli-konum',heading:'Der von dir gespeicherte Entdeckungsstandort',blocks:[
          {p:'Wenn du in der Suche einen Standort auswählst und speicherst, wird dieser Standort mit voller Genauigkeit gespeichert, zusammen mit Bezeichnung, Adresse und Anbieterkennung.'},
          {p:'Das unterscheidet sich bewusst von den beiden obigen Verhaltensweisen: Es ist eine Einstellung, die du gespeichert hast, damit die Suche dich nicht jedes Mal nach einem Standort fragt. Deshalb steht auf dieser Seite nicht „wir speichern deinen genauen Standort nicht“ — für einen gespeicherten Standort wäre das unzutreffend.'},
          {p:'Du kannst den gespeicherten Standort in deinem Profil ändern oder entfernen. Beim Löschen deines Kontos wird er ebenfalls gelöscht.'},
        ]},
        {id:'ucuncu-taraf',heading:'Wer deinen Standort erhält',blocks:[
          {p:'Bei einer Suche werden deine Anfrage, deine Koordinaten und der Suchradius an Google Places übermittelt, um Geschäftsergebnisse zu liefern.'},
          {p:'An den KI-Dienst, der die Bedeutung deiner Suche auswertet, wird dein Standort nicht übermittelt. Dieser Dienst erhält nur den eingegebenen Text und deine Spracheinstellung.'},
        ]},
        {id:'tarayici',heading:'Was in deinem Browser bleibt',blocks:[
          {p:'Die zuletzt vom Gerät ermittelte Position wird im lokalen Speicher deines Browsers abgelegt, damit die Suche nicht wiederholt nach der Berechtigung fragt. Sie verlässt deinen Browser nicht; das Löschen der Browserdaten entfernt sie.'},
          {p:'Du kannst die Standortberechtigung jederzeit in den Einstellungen deines Browsers oder Betriebssystems widerrufen. Der Widerruf hindert dich nicht an der Nutzung des Produkts, er betrifft nur den Teil der Suche, der einen Standort benötigt.'},
        ]},
        {id:'sinirlar',heading:'Grenzen der Genauigkeit',blocks:[
          {p:'Der Standort stammt von deinem Gerät und ist nicht immer korrekt. In Innenräumen, zwischen hohen Gebäuden oder bei schwachem Signal wächst der Fehler. Deshalb erfasst die Besuchsbestätigung auch die vom Gerät gemeldete Genauigkeit.'},
          {p:'Es sei ebenfalls gesagt, dass Browser-Standortdaten absichtlich verändert werden können. Die Bestätigung ist ein Hinweis darauf, dass du bei gutgläubiger Nutzung tatsächlich dort warst, kein Beweis, der absichtlichen Missbrauch ausschließt.'},
          {p:'Bevor du irgendwohin fährst, empfehlen wir, unabhängig zu prüfen, ob das Geschäft geöffnet und die Adresse aktuell ist.'},
        ]},
      ],
    },
    ru:{
      title:'Конфиденциальность геоданных',
      summary:'Местоположение — основа этого продукта. Здесь описано, когда оно запрашивается, с какой точностью обрабатывается, что сохраняется и что не сохраняется никогда. Есть три разных сценария, и они отличаются.',
      sections:[
        {id:'ne-zaman',heading:'Когда запрашивается местоположение',blocks:[
          {p:'Разрешение на доступ к местоположению запрашивается только в двух случаях: при поиске и при подтверждении визита перед написанием отзыва. При просмотре ленты или страницы магазина оно не запрашивается.'},
          {p:'Если вы откажете, вы по-прежнему сможете читать ленту и страницы магазинов. Поиску нужно местоположение, чтобы упорядочить результаты от ближайших к дальним; его можно указать, выбрав место из списка вместо использования устройства.'},
        ]},
        {id:'arama',heading:'Местоположение при поиске',blocks:[
          {p:'При поиске ваши координаты используются для сортировки результатов по расстоянию. Перед записью они намеренно огрубляются: по умолчанию до трёх знаков после запятой, то есть примерно до области в 110 метров. Сохраняется ваш район, а не ваше здание.'},
          {p:'Даже эти огрублённые координаты не хранятся постоянно. Поля координат в записях поиска очищаются через 30 дней; сам поиск — введённый текст и число результатов — хранится до 365 дней.'},
          {note:'Эти сроки заданы в служебной задаче в коде. Как часто она выполняется в рабочей среде — отдельный эксплуатационный вопрос; здесь описано только заданное поведение.'},
        ]},
        {id:'ziyaret',heading:'Подтверждение визита',blocks:[
          {p:'Чтобы написать отзыв, нужно подтвердить, что вы находитесь у магазина. Ваши координаты при этой проверке не сохраняются ни в каком виде.'},
          {p:'Записываются два числа: расстояние до магазина и точность, о которой сообщило устройство. Сохраняется то, насколько близко вы были к магазину, а не где вы были. Запись действует 30 дней и удаляется через 30 дней после истечения срока или использования в отзыве.'},
        ]},
        {id:'kayitli-konum',heading:'Сохранённое вами место поиска',blocks:[
          {p:'Если вы выбрали и сохранили место в поиске, оно сохраняется с полной точностью вместе с названием, адресом и идентификатором поставщика.'},
          {p:'Это намеренно отличается от двух предыдущих сценариев: это настройка, которую вы сами сохранили, чтобы поиск не запрашивал место каждый раз. Поэтому на этой странице не говорится «мы не храним ваше точное местоположение» — для сохранённого места это было бы неправдой.'},
          {p:'Сохранённое место можно изменить или удалить в профиле. При удалении аккаунта оно также удаляется.'},
        ]},
        {id:'ucuncu-taraf',heading:'Кто получает ваше местоположение',blocks:[
          {p:'При поиске ваш запрос, координаты и радиус поиска передаются в Google Places для получения результатов по магазинам.'},
          {p:'В сервис искусственного интеллекта, который определяет смысл запроса, местоположение не передаётся. Туда попадают только введённый текст и выбранный язык.'},
        ]},
        {id:'tarayici',heading:'Что остаётся в браузере',blocks:[
          {p:'Последние полученные с устройства координаты хранятся в локальном хранилище браузера, чтобы поиск не запрашивал разрешение повторно. Они не покидают браузер; очистка данных браузера их удаляет.'},
          {p:'Разрешение на доступ к местоположению можно отозвать в любой момент в настройках браузера или операционной системы. Отзыв не мешает пользоваться продуктом и влияет только на ту часть поиска, которой нужно местоположение.'},
        ]},
        {id:'sinirlar',heading:'Пределы точности',blocks:[
          {p:'Местоположение поступает с вашего устройства и не всегда верно. В помещении, среди высоких зданий или при слабом сигнале погрешность растёт. Поэтому при подтверждении визита фиксируется и заявленная устройством точность.'},
          {p:'Следует также сказать, что данные о местоположении в браузере можно намеренно изменить. Подтверждение — это признак того, что при добросовестном использовании вы действительно были на месте, а не доказательство, исключающее умышленное злоупотребление.'},
          {p:'Перед поездкой рекомендуем самостоятельно убедиться, что магазин открыт, а адрес актуален.'},
        ]},
      ],
    },
  },
};

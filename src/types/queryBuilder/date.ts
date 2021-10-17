import { NumArg, QueryField, QueryObject, TextArg } from '../queryBuilder';

type Unit =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'quarters'
  | 'years';

type Locale =
  | 'af'
  | 'ar-ma'
  | 'ar-ma'
  | 'ar-sa'
  | 'ar-tn'
  | 'ar'
  | 'az'
  | 'be'
  | 'bg'
  | 'bn'
  | 'bo'
  | 'br'
  | 'bs'
  | 'ca'
  | 'cs'
  | 'cv'
  | 'cy'
  | 'da'
  | 'de-at'
  | 'de'
  | 'el'
  | 'en-au'
  | 'en-ca'
  | 'en-gb'
  | 'en-ie'
  | 'en-nz'
  | 'eo'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fo'
  | 'fr-ca'
  | 'fr-ch'
  | 'fr'
  | 'fy'
  | 'gl'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'hy-am'
  | 'id'
  | 'is'
  | 'it'
  | 'ja'
  | 'jv'
  | 'ka'
  | 'km'
  | 'ko'
  | 'lb'
  | 'lt'
  | 'lv'
  | 'me'
  | 'mk'
  | 'ml'
  | 'mr'
  | 'ms'
  | 'my'
  | 'nb'
  | 'ne'
  | 'nl'
  | 'nn'
  | 'pl'
  | 'pt-br'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sq'
  | 'sr-cyrl'
  | 'sr'
  | 'sv'
  | 'ta'
  | 'th'
  | 'tl-ph'
  | 'tr'
  | 'tzl'
  | 'tzm-latn'
  | 'tzm'
  | 'uk'
  | 'uz'
  | 'vi'
  | 'zh-cn'
  | 'zh-tw';

type Timezone =
  | 'Africa/Abidjan'
  | 'Africa/Accra'
  | 'Africa/Algiers'
  | 'Africa/Bissau'
  | 'Africa/Cairo'
  | 'Africa/Casablanca'
  | 'Africa/Ceuta'
  | 'Africa/El_Aaiun'
  | 'Africa/Johannesburg'
  | 'Africa/Khartoum'
  | 'Africa/Lagos'
  | 'Africa/Maputo'
  | 'Africa/Monrovia'
  | 'Africa/Nairobi'
  | 'Africa/Ndjamena'
  | 'Africa/Tripoli'
  | 'Africa/Tunis'
  | 'Africa/Windhoek'
  | 'America/Adak'
  | 'America/Anchorage'
  | 'America/Araguaina'
  | 'America/Argentina/Buenos_Aires'
  | 'America/Argentina/Catamarca'
  | 'America/Argentina/Cordoba'
  | 'America/Argentina/Jujuy'
  | 'America/Argentina/La_Rioja'
  | 'America/Argentina/Mendoza'
  | 'America/Argentina/Rio_Gallegos'
  | 'America/Argentina/Salta'
  | 'America/Argentina/San_Juan'
  | 'America/Argentina/San_Luis'
  | 'America/Argentina/Tucuman'
  | 'America/Argentina/Ushuaia'
  | 'America/Asuncion'
  | 'America/Atikokan'
  | 'America/Bahia'
  | 'America/Bahia_Banderas'
  | 'America/Barbados'
  | 'America/Belem'
  | 'America/Belize'
  | 'America/Blanc-Sablon'
  | 'America/Boa_Vista'
  | 'America/Bogota'
  | 'America/Boise'
  | 'America/Cambridge_Bay'
  | 'America/Campo_Grande'
  | 'America/Cancun'
  | 'America/Caracas'
  | 'America/Cayenne'
  | 'America/Chicago'
  | 'America/Chihuahua'
  | 'America/Costa_Rica'
  | 'America/Creston'
  | 'America/Cuiaba'
  | 'America/Curacao'
  | 'America/Danmarkshavn'
  | 'America/Dawson'
  | 'America/Dawson_Creek'
  | 'America/Denver'
  | 'America/Detroit'
  | 'America/Edmonton'
  | 'America/Eirunepe'
  | 'America/El_Salvador'
  | 'America/Fort_Nelson'
  | 'America/Fortaleza'
  | 'America/Glace_Bay'
  | 'America/Godthab'
  | 'America/Goose_Bay'
  | 'America/Grand_Turk'
  | 'America/Guatemala'
  | 'America/Guayaquil'
  | 'America/Guyana'
  | 'America/Halifax'
  | 'America/Havana'
  | 'America/Hermosillo'
  | 'America/Indiana/Indianapolis'
  | 'America/Indiana/Knox'
  | 'America/Indiana/Marengo'
  | 'America/Indiana/Petersburg'
  | 'America/Indiana/Tell_City'
  | 'America/Indiana/Vevay'
  | 'America/Indiana/Vincennes'
  | 'America/Indiana/Winamac'
  | 'America/Inuvik'
  | 'America/Iqaluit'
  | 'America/Jamaica'
  | 'America/Juneau'
  | 'America/Kentucky/Louisville'
  | 'America/Kentucky/Monticello'
  | 'America/La_Paz'
  | 'America/Lima'
  | 'America/Los_Angeles'
  | 'America/Maceio'
  | 'America/Managua'
  | 'America/Manaus'
  | 'America/Martinique'
  | 'America/Matamoros'
  | 'America/Mazatlan'
  | 'America/Menominee'
  | 'America/Merida'
  | 'America/Metlakatla'
  | 'America/Mexico_City'
  | 'America/Miquelon'
  | 'America/Moncton'
  | 'America/Monterrey'
  | 'America/Montevideo'
  | 'America/Nassau'
  | 'America/New_York'
  | 'America/Nipigon'
  | 'America/Nome'
  | 'America/Noronha'
  | 'America/North_Dakota/Beulah'
  | 'America/North_Dakota/Center'
  | 'America/North_Dakota/New_Salem'
  | 'America/Ojinaga'
  | 'America/Panama'
  | 'America/Pangnirtung'
  | 'America/Paramaribo'
  | 'America/Phoenix'
  | 'America/Port-au-Prince'
  | 'America/Port_of_Spain'
  | 'America/Porto_Velho'
  | 'America/Puerto_Rico'
  | 'America/Rainy_River'
  | 'America/Rankin_Inlet'
  | 'America/Recife'
  | 'America/Regina'
  | 'America/Resolute'
  | 'America/Rio_Branco'
  | 'America/Santarem'
  | 'America/Santiago'
  | 'America/Santo_Domingo'
  | 'America/Sao_Paulo'
  | 'America/Scoresbysund'
  | 'America/Sitka'
  | 'America/St_Johns'
  | 'America/Swift_Current'
  | 'America/Tegucigalpa'
  | 'America/Thule'
  | 'America/Thunder_Bay'
  | 'America/Tijuana'
  | 'America/Toronto'
  | 'America/Vancouver'
  | 'America/Whitehorse'
  | 'America/Winnipeg'
  | 'America/Yakutat'
  | 'America/Yellowknife'
  | 'Antarctica/Casey'
  | 'Antarctica/Davis'
  | 'Antarctica/DumontDUrville'
  | 'Antarctica/Macquarie'
  | 'Antarctica/Mawson'
  | 'Antarctica/Palmer'
  | 'Antarctica/Rothera'
  | 'Antarctica/Syowa'
  | 'Antarctica/Troll'
  | 'Antarctica/Vostok'
  | 'Asia/Almaty'
  | 'Asia/Amman'
  | 'Asia/Anadyr'
  | 'Asia/Aqtau'
  | 'Asia/Aqtobe'
  | 'Asia/Ashgabat'
  | 'Asia/Baghdad'
  | 'Asia/Baku'
  | 'Asia/Bangkok'
  | 'Asia/Barnaul'
  | 'Asia/Beirut'
  | 'Asia/Bishkek'
  | 'Asia/Brunei'
  | 'Asia/Chita'
  | 'Asia/Choibalsan'
  | 'Asia/Colombo'
  | 'Asia/Damascus'
  | 'Asia/Dhaka'
  | 'Asia/Dili'
  | 'Asia/Dubai'
  | 'Asia/Dushanbe'
  | 'Asia/Gaza'
  | 'Asia/Hebron'
  | 'Asia/Ho_Chi_Minh'
  | 'Asia/Hong_Kong'
  | 'Asia/Hovd'
  | 'Asia/Irkutsk'
  | 'Asia/Jakarta'
  | 'Asia/Jayapura'
  | 'Asia/Jerusalem'
  | 'Asia/Kabul'
  | 'Asia/Kamchatka'
  | 'Asia/Karachi'
  | 'Asia/Kathmandu'
  | 'Asia/Khandyga'
  | 'Asia/Kolkata'
  | 'Asia/Krasnoyarsk'
  | 'Asia/Kuala_Lumpur'
  | 'Asia/Kuching'
  | 'Asia/Macau'
  | 'Asia/Magadan'
  | 'Asia/Makassar'
  | 'Asia/Manila'
  | 'Asia/Nicosia'
  | 'Asia/Novokuznetsk'
  | 'Asia/Novosibirsk'
  | 'Asia/Omsk'
  | 'Asia/Oral'
  | 'Asia/Pontianak'
  | 'Asia/Pyongyang'
  | 'Asia/Qatar'
  | 'Asia/Qyzylorda'
  | 'Asia/Rangoon'
  | 'Asia/Riyadh'
  | 'Asia/Sakhalin'
  | 'Asia/Samarkand'
  | 'Asia/Seoul'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Srednekolymsk'
  | 'Asia/Taipei'
  | 'Asia/Tashkent'
  | 'Asia/Tbilisi'
  | 'Asia/Tehran'
  | 'Asia/Thimphu'
  | 'Asia/Tokyo'
  | 'Asia/Tomsk'
  | 'Asia/Ulaanbaatar'
  | 'Asia/Urumqi'
  | 'Asia/Ust-Nera'
  | 'Asia/Vladivostok'
  | 'Asia/Yakutsk'
  | 'Asia/Yekaterinburg'
  | 'Asia/Yerevan'
  | 'Atlantic/Azores'
  | 'Atlantic/Bermuda'
  | 'Atlantic/Canary'
  | 'Atlantic/Cape_Verde'
  | 'Atlantic/Faroe'
  | 'Atlantic/Madeira'
  | 'Atlantic/Reykjavik'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Stanley'
  | 'Australia/Adelaide'
  | 'Australia/Brisbane'
  | 'Australia/Broken_Hill'
  | 'Australia/Currie'
  | 'Australia/Darwin'
  | 'Australia/Eucla'
  | 'Australia/Hobart'
  | 'Australia/Lindeman'
  | 'Australia/Lord_Howe'
  | 'Australia/Melbourne'
  | 'Australia/Perth'
  | 'Australia/Sydney'
  | 'GMT'
  | 'Europe/Amsterdam'
  | 'Europe/Andorra'
  | 'Europe/Astrakhan'
  | 'Europe/Athens'
  | 'Europe/Belgrade'
  | 'Europe/Berlin'
  | 'Europe/Brussels'
  | 'Europe/Bucharest'
  | 'Europe/Budapest'
  | 'Europe/Chisinau'
  | 'Europe/Copenhagen'
  | 'Europe/Dublin'
  | 'Europe/Gibraltar'
  | 'Europe/Helsinki'
  | 'Europe/Istanbul'
  | 'Europe/Kaliningrad'
  | 'Europe/Kiev'
  | 'Europe/Kirov'
  | 'Europe/Lisbon'
  | 'Europe/London'
  | 'Europe/Luxembourg'
  | 'Europe/Madrid'
  | 'Europe/Malta'
  | 'Europe/Minsk'
  | 'Europe/Monaco'
  | 'Europe/Moscow'
  | 'Europe/Oslo'
  | 'Europe/Paris'
  | 'Europe/Prague'
  | 'Europe/Riga'
  | 'Europe/Rome'
  | 'Europe/Samara'
  | 'Europe/Simferopol'
  | 'Europe/Sofia'
  | 'Europe/Stockholm'
  | 'Europe/Tallinn'
  | 'Europe/Tirane'
  | 'Europe/Ulyanovsk'
  | 'Europe/Uzhgorod'
  | 'Europe/Vienna'
  | 'Europe/Vilnius'
  | 'Europe/Volgograd'
  | 'Europe/Warsaw'
  | 'Europe/Zaporozhye'
  | 'Europe/Zurich'
  | 'Indian/Chagos'
  | 'Indian/Christmas'
  | 'Indian/Cocos'
  | 'Indian/Kerguelen'
  | 'Indian/Mahe'
  | 'Indian/Maldives'
  | 'Indian/Mauritius'
  | 'Indian/Reunion'
  | 'Pacific/Apia'
  | 'Pacific/Auckland'
  | 'Pacific/Bougainville'
  | 'Pacific/Chatham'
  | 'Pacific/Chuuk'
  | 'Pacific/Easter'
  | 'Pacific/Efate'
  | 'Pacific/Enderbury'
  | 'Pacific/Fakaofo'
  | 'Pacific/Fiji'
  | 'Pacific/Funafuti'
  | 'Pacific/Galapagos'
  | 'Pacific/Gambier'
  | 'Pacific/Guadalcanal'
  | 'Pacific/Guam'
  | 'Pacific/Honolulu'
  | 'Pacific/Kiritimati'
  | 'Pacific/Kosrae'
  | 'Pacific/Kwajalein'
  | 'Pacific/Majuro'
  | 'Pacific/Marquesas'
  | 'Pacific/Nauru'
  | 'Pacific/Niue'
  | 'Pacific/Norfolk'
  | 'Pacific/Noumea'
  | 'Pacific/Pago_Pago'
  | 'Pacific/Palau'
  | 'Pacific/Pitcairn'
  | 'Pacific/Pohnpei'
  | 'Pacific/Port_Moresby'
  | 'Pacific/Rarotonga'
  | 'Pacific/Tahiti'
  | 'Pacific/Tarawa'
  | 'Pacific/Tongatapu'
  | 'Pacific/Wake'
  | 'Pacific/Wallis';

interface DateObj extends QueryObject {
  date: TextArg;
}

export interface DoubleDateObj extends QueryObject {
  date1: TextArg;
  date2: TextArg;
}

export interface AddArg extends DateObj {
  count: NumArg;
  units: Unit;
}

export interface DiffArg extends DoubleDateObj {
  units: Unit;
}

export interface SameArg extends DoubleDateObj {
  units?: Unit;
}

export interface FormatArg extends QueryObject {
  date: TextArg | SetArg;
  format?: TextArg;
}

export interface ParseArg extends FormatArg {
  locale?: TextArg;
}

export interface SetArg extends DateObj {
  identifier: Locale | Timezone;
}

export interface WeekArg extends DateObj {
  start?: 'Sunday' | 'Monday';
}

export interface WorkDayArg extends DateObj {
  numDays: NumArg;
  holidays?: string[];
}

export interface WorkDayDiffArg extends DoubleDateObj {
  holidays?: string[];
}

type SingleArgFunc = (arg: QueryField) => string;
type AddFunc = (arg: AddArg) => string;
type DiffFunc = (arg: DiffArg) => string;
type SameFunc = (arg: SameArg) => string;
type FormatFunc = (arg: FormatArg) => string;
type ParseFunc = (arg: ParseArg) => string;
type PastFutureFunc = (arg: DoubleDateObj) => string;
type WeekFunc = (arg: WeekArg) => string;
type WorkDayFunc = (arg: WorkDayArg) => string;
type WorkDayDiffFunc = (arg: WorkDayDiffArg) => string;
type LastModifiedFunc = (arg: string[]) => string;

export interface SingleArgDateFuncs extends Record<string, SingleArgFunc> {
  $dateStr: SingleArgFunc;
  $day: SingleArgFunc;
  $hour: SingleArgFunc;
  $minute: SingleArgFunc;
  $month: SingleArgFunc;
  $second: SingleArgFunc;
  $timeStr: SingleArgFunc;
  $toNow: SingleArgFunc;
  $fromNow: SingleArgFunc;
  $year: SingleArgFunc;
}

export interface DateAddFunc extends Record<string, AddFunc> {
  $dateAdd: AddFunc;
}

export interface DateDiffFunc extends Record<string, DiffFunc> {
  $dateDiff: DiffFunc;
}

export interface DateSameFunc extends Record<string, SameFunc> {
  $dateSame: SameFunc;
}

export interface DatePastFutureFuncs extends Record<string, PastFutureFunc> {
  $dateBefore: PastFutureFunc;
  $dateAfter: PastFutureFunc;
}

export interface DateFormatFunc extends Record<string, FormatFunc> {
  $dateFormat: FormatFunc;
}

export interface DateParseFunc extends Record<string, ParseFunc> {
  $dateParse: ParseFunc;
}

export interface DateWeekFuncs extends Record<string, WeekFunc> {
  $weekDay: WeekFunc;
  $weekNum: WeekFunc;
}

export interface DateWorkDayFunc extends Record<string, WorkDayFunc> {
  $workDay: WorkDayFunc;
}

export interface DateWorkDayDiffFunc extends Record<string, WorkDayDiffFunc> {
  $workDayDiff: WorkDayDiffFunc;
}

export interface DateLastModifiedFunc extends Record<string, LastModifiedFunc> {
  $lastModified: LastModifiedFunc;
}

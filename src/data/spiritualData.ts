export interface DhikrItem {
  id: string;
  category: 'waking' | 'morning' | 'evening' | 'sleeping';
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  arabicText: string;
  transliteration?: string;
  translation: {
    en: string;
    fr: string;
  };
  repeatCount: number;
  rewardOrVirtue?: {
    ar: string;
    en: string;
    fr: string;
  };
}

export type DailyAthkarItem = DhikrItem;

export interface QuranWardItem {
  id: string;
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  prayerName: {
    ar: string;
    en: string;
    fr: string;
  };
  prayerTiming: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  totalVerses: number;
  virtueArabic: string;
  virtueEnglish: string;
  arabicText: string[];
}

export type QuranWard = QuranWardItem;

export const QURAN_DAILY_WARDS: QuranWardItem[] = [
  {
    id: 'ward_fajr_yasin',
    surahNumber: 36,
    surahNameArabic: 'سورة يس',
    surahNameEnglish: 'Surah Yasin',
    prayerName: {
      ar: 'بعد صلاة الصبح (الفجر)',
      en: 'After Fajr (Morning Prayer)',
      fr: 'Après la prière de Fajr (Aube)',
    },
    prayerTiming: 'fajr',
    totalVerses: 83,
    virtueArabic: 'قلب القرآن وتيسير الأمور وقضاء الحوائج وطلب البركة في بداية اليوم.',
    virtueEnglish: 'The heart of the Quran, bringing ease, barakah, and clarity at the start of the day.',
    arabicText: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'يس ﴿١﴾ وَالْقُرْآنِ الْحَكِيمِ ﴿٢﴾ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ﴿٣﴾ عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ ﴿٤﴾ تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ ﴿٥﴾ لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ ﴿٦﴾',
      'لَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ ﴿٧﴾ إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُمْ مُقْمَحُونَ ﴿٨﴾ وَجَعَلْنَا مِنْ بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ ﴿٩﴾',
      'وَسَوَاءٌ عَلَيْهِمْ أَأَنْذَرْتَهُمْ أَمْ لَمْ تُنْذِرْهُمْ لَا يُؤْمِنُونَ ﴿١٠﴾ إِنَّمَا تُنْذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ بِالْغَيْبِ فَبَشِّرْهُ بِمَغْفِرَةٍ وَأَجْرٍ كَرِيمٍ ﴿١١﴾ إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُبِينٍ ﴿١٢﴾',
      'وَاضْرِبْ لَهُمْ مَثَلًا أَصْحَابَ الْقَرْيَةِ إِذْ جَاءَهَا الْمُرْسَلُونَ ﴿١٣﴾ إِذْ أَرْسَلْنَا إِلَيْهِمُ اثْنَيْنِ فَكَذَّبُوهُمَا فَعَزَّزْنَا بِثَالِثٍ فَقَالُوا إِنَّا إِلَيْكُمْ مُرْسَلُونَ ﴿١٤﴾ قَالُوا مَا أَنْتُمْ إِلَّا بَشَرٌ مِثْلُنَا وَمَا أَنْزَلَ الرَّحْمَٰنُ مِنْ شَيْءٍ إِنْ أَنْتُمْ إِلَّا تَكْذِبُونَ ﴿١٥﴾',
      'قَالُوا رَبُّنَا يَعْلَمُ إِنَّا إِلَيْكُمْ لَمُرْسَلُونَ ﴿١٦﴾ وَمَا عَلَيْنَا إِلَّا الْبَلَاغُ الْمُبِينُ ﴿١٧﴾',
      'وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ ﴿٢٠﴾ اتَّبِعُوا مَنْ لَا يَسْأَلُكُمْ أَجْرًا وَهُمْ مُهْتَدُونَ ﴿٢١﴾ وَمَا لِيَ لَا أَعْبُدُ الَّذِي فَطَرَنِي وَإِلَيْهِ تُرْجَعُونَ ﴿٢٢﴾',
      'قِيلَ ادْخُلِ الْجَنَّةَ قَالَ يَا لَيْتَ قَوْمِي يَعْلَمُونَ ﴿٢٦﴾ بِمَا غَفَرَ لِي رَبِّي وَجَعَلَنِي مِنَ الْمُكْرَمِينَ ﴿٢٧﴾',
      'سُبْحَانَ الَّذِي خَلَقَ الْأَزْوَاجَ كُلَّهَا مِمَّا تُنْبِتُ الْأَرْضُ وَمِنْ أَنْفُسِهِمْ وَمِمَّا لَا يَعْلَمُونَ ﴿٣٦﴾ وَآيَةٌ لَهُمُ اللَّيْلُ نَسْلَخُ مِنْهُ النَّهَارَ فَإِذَا هُمْ مُظْلِمُونَ ﴿٣٧﴾ وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَهَا ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ ﴿٣٨﴾',
      'سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ ﴿٥٨﴾ وَامْتَازُوا الْيَوْمَ أَيُّهَا الْمُجْرِمُونَ ﴿٥٩﴾',
      'أَوَلَمْ يَرَ الْإِنْسَانُ أَنَّا خَلَقْنَاهُ مِنْ نُطْفَةٍ فَإِذَا هُوَ خَصِيمٌ مُبِينٌ ﴿٧٧﴾ وَضَرَبَ لَنَا مَثَلًا وَنَسِيَ خَلْقَهُ قَالَ مَنْ يُحْيِي الْعِظَامَ وَهِيَ رَمِيمٌ ﴿٧٨﴾ قُلْ يُحْيِيهَا الَّذِي أَنْشَأَهَا أَوَّلَ مَرَّةٍ وَهُوَ بِكُلِّ خَلْقٍ عَلِيمٌ ﴿٧٩﴾',
      'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ ﴿٨٢﴾ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ ﴿٨٣﴾',
    ],
  },
  {
    id: 'ward_dhuhr_waqiah',
    surahNumber: 56,
    surahNameArabic: 'سورة الواقعة',
    surahNameEnglish: 'Surah Al-Waqi’ah',
    prayerName: {
      ar: 'بعد صلاة الظهر',
      en: 'After Dhuhr (Noon Prayer)',
      fr: 'Après la prière de Dhuhr (Midi)',
    },
    prayerTiming: 'dhuhr',
    totalVerses: 96,
    virtueArabic: 'سورة الغنى والبركة في الرزق والوقاية من الفاقة وتذكير باليوم الآخر.',
    virtueEnglish: 'Surah of sustained provision, gratitude, and remembrance of the Day of Judgment.',
    arabicText: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'إِذَا وَقَعَتِ الْوَاقِعَةُ ﴿١﴾ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ﴿٢﴾ خَافِضَةٌ رَافِعَةٌ ﴿٣﴾ إِذَا رُجَّتِ الْأَرْضُ رَجًّا ﴿٤﴾ وَبُسَّتِ الْجِبَالُ بَسًّا ﴿٥﴾ فَكَانَتْ هَبَاءً مُنْبَثًّا ﴿٦﴾',
      'وَكُنْتُمْ أَزْوَاجًا ثَلَاثَةً ﴿٧﴾ فَأَصْحَابُ الْمَيْمَنَةِ مَا أَصْحَابُ الْمَيْمَنَةِ ﴿٨﴾ وَأَصْحَابُ الْمَشْأَمَةِ مَا أَصْحَابُ الْمَشْأَمَةِ ﴿٩﴾ وَالسَّابِقُونَ السَّابِقُونَ ﴿١٠﴾ أُولَٰئِكَ الْمُقَرَّبُونَ ﴿١١﴾ فِي جَنَّاتِ النَّعِيمِ ﴿١٢﴾',
      'ثُلَّةٌ مِنَ الْأَوَّلِينَ ﴿١٣﴾ وَقَلِيلٌ مِنَ الْآخِرِينَ ﴿١٤﴾ عَلَىٰ سُرُرٍ مَوْضُونَةٍ ﴿١٥﴾ مُتَّكِئِينَ عَلَيْهَا مُتَقَابِلِينَ ﴿١٦﴾ يَطُوفُ عَلَيْهِمْ وِلْدَانٌ مُخَلَّدُونَ ﴿١٧﴾ بِأَكْوَابٍ وَأَبَارِيقَ وَكَأْسٍ مِنْ مَعِينٍ ﴿١٨﴾',
      'أَفَرَأَيْتُمْ مَا تُمْنُونَ ﴿٥٨﴾ أَأَنْتُمْ تَخْلُقُونَهُ أَمْ نَحْنُ الْخَالِقُونَ ﴿٥٩﴾ نَحْنُ قَدَّرْنَا بَيْنَكُمُ الْمَوْتَ وَمَا نَحْنُ بِمَسْبُوقِينَ ﴿٦٠﴾',
      'أَفَرَأَيْتُمُ الْمَاءَ الَّذِي تَشْرَبُونَ ﴿٦٨﴾ أَأَنْتُمْ أَنْزَلْتُمُوهُ مِنَ الْمُزْنِ أَمْ نَحْنُ الْمُنْزِلُونَ ﴿٦٩﴾ لَوْ نَشَاءُ جَعَلْنَاهُ أُجَاجًا فَلَوْلَا تَشْكُرُونَ ﴿٧٠﴾',
      'فَلَا أُقْسِمُ بِمَوَاقِعِ النُّجُومِ ﴿٧٥﴾ وَإِنَّهُ لَقَسَمٌ لَوْ تَعْلَمُونَ عَظِيمٌ ﴿٧٦﴾ إِنَّهُ لَقُرْآنٌ كَرِيمٌ ﴿٧٧﴾ فِي كِتَابٍ مَكْنُونٍ ﴿٧٨﴾ لَا يَمَسُّهُ إِلَّا الْمُطَهَّرُونَ ﴿٧٩﴾ تَنْزِيلٌ مِنْ رَبِّ الْعَالَمِينَ ﴿٨٠﴾',
      'فَسَبِّحْ بِاسْمِ رَبِّكَ الْعَظِيمِ ﴿٩٦﴾',
    ],
  },
  {
    id: 'ward_asr_rahman',
    surahNumber: 55,
    surahNameArabic: 'سورة الرحمن',
    surahNameEnglish: 'Surah Ar-Rahman',
    prayerName: {
      ar: 'بعد صلاة العصر',
      en: 'After Asr (Afternoon Prayer)',
      fr: 'Après la prière de Asr (Après-midi)',
    },
    prayerTiming: 'asr',
    totalVerses: 78,
    virtueArabic: 'عروس القرآن، وتأمل عظيم في نعم الله وآلائه على الثقلين وتجديد الشكر.',
    virtueEnglish: 'The bride of the Quran, a powerful contemplation of Allah’s infinite bounties and blessings.',
    arabicText: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنْسَانَ ﴿٣﴾ عَلَّمَهُ الْبَيَانَ ﴿٤﴾ الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ ﴿٥﴾ وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ ﴿٦﴾ وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ﴿٧﴾ أَلَّا تَطْغَوْا فِي الْمِيزَانِ ﴿٨﴾',
      'وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ ﴿٩﴾ وَالْأَرْضَ وَضَعَهَا لِلْأَنَامِ ﴿١٠﴾ فِيهَا فَاكِهَةٌ وَالنَّخْلُ ذَاتُ الْأَكْمَامِ ﴿١١﴾ وَالْحَبُّ ذُو الْعَصْفِ وَالرَّيْحَانُ ﴿١٢﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿١٣﴾',
      'خَلَقَ الْإِنْسَانَ مِنْ صَلْصَالٍ كَالْفَخَّارِ ﴿١٤﴾ وَخَلَقَ الْجَانَّ مِنْ مَارِجٍ مِنْ نَارٍ ﴿١٥﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿١٦﴾ رَبُّ الْمَشْرِقَيْنِ وَرَبُّ الْمَغْرِبَيْنِ ﴿١٧﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿١٨﴾',
      'مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ ﴿١٩﴾ بَيْنَهُمَا بَرْزَخٌ لَا يَبْغِيَانِ ﴿٢٠﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿٢١﴾ يَخْرُجُ مِنْهُمَا اللُّؤْلُؤُ وَالْمَرْجَانُ ﴿٢٢﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿٢٣﴾',
      'كُلُّ مَنْ عَلَيْهَا فَانٍ ﴿٢٦﴾ وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ ﴿٢٧﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿٢٨﴾',
      'هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ ﴿٦٠﴾ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ﴿٦١﴾',
      'تَبَارَكَ اسْمُ رَبِّكَ ذِي الْجَلَالِ وَالْإِكْرَامِ ﴿٧٨﴾',
    ],
  },
  {
    id: 'ward_maghrib_dukhan',
    surahNumber: 44,
    surahNameArabic: 'سورة الدخان',
    surahNameEnglish: 'Surah Ad-Dukhan',
    prayerName: {
      ar: 'بعد صلاة المغرب',
      en: 'After Maghrib (Sunset Prayer)',
      fr: 'Après la prière de Maghrib (Coucher du soleil)',
    },
    prayerTiming: 'maghrib',
    totalVerses: 59,
    virtueArabic: 'مغفرة الذنوب والحفظ والوقاية وتلاوة القرآن في وقت الغروب.',
    virtueEnglish: 'Seeking forgiveness, divine protection, and deep Quranic connection at twilight.',
    arabicText: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'حم ﴿١﴾ وَالْكِتَابِ الْمُبِينِ ﴿٢﴾ إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةٍ مُبَارَكَةٍ إِنَّا كُنَّا مُنْذِرِينَ ﴿٣﴾ فِيهَا يُفْرَقُ كُلُّ أَمْرٍ حَكِيمٍ ﴿٤﴾ أَمْرًا مِنْ عِنْدِنَا إِنَّا كُنَّا مُرْسِلِينَ ﴿٥﴾ رَحْمَةً مِنْ رَبِّكَ إِنَّهُ هُوَ السَّمِيعُ الْعَلِيمُ ﴿٦﴾',
      'رَبِّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا إِنْ كُنْتُمْ مُوقِنِينَ ﴿٧﴾ لَا إِلَٰهَ إِلَّا هُوَ يُحْيِي وَيُمِيتُ رَبُّكُمْ وَرَبُّ آبَائِكُمُ الْأَوَّلِينَ ﴿٨﴾ بَلْ هُمْ فِي شَكٍّ يَلْعَبُونَ ﴿٩﴾',
      'فَارْتَقِبْ يَوْمَ تَأْتِي السَّمَاءُ بِدُخَانٍ مُبِينٍ ﴿١٠﴾ يَغْشَى النَّاسَ هَٰذَا عَذَابٌ أَلِيمٌ ﴿١١﴾ رَبَّنَا اكْشِفْ عَنَّا الْعَذَابَ إِنَّا مُؤْمِنُونَ ﴿١٢﴾',
      'إِنَّ الْمُتَّقِينَ فِي مَقَامٍ أَمِينٍ ﴿٥١﴾ فِي جَنَّاتٍ وَعُيُونٍ ﴿٥٢﴾ يَلْبَسُونَ مِنْ سُنْدُسٍ وَإِسْتَبْرَقٍ مُتَقَابِلِينَ ﴿٥٣﴾ كَذَٰلِكَ وَزَوَّجْنَاهُمْ بِحُورٍ عِينٍ ﴿٥٤﴾',
      'فَإِنَّمَا يَسَّرْنَاهُ بِلِسَانِكَ لَعَلَّهُمْ يَتَذَكَّرُونَ ﴿٥٨﴾ فَارْتَقِبْ إِنَّهُمْ مُرْتَقِبُونَ ﴿٥٩﴾',
    ],
  },
  {
    id: 'ward_isha_mulk',
    surahNumber: 67,
    surahNameArabic: 'سورة الملك (المنجية)',
    surahNameEnglish: 'Surah Al-Mulk',
    prayerName: {
      ar: 'بعد صلاة العشاء وقبل النوم',
      en: 'After Isha & Before Sleep',
      fr: 'Après Isha & Avant de Dormir',
    },
    prayerTiming: 'isha',
    totalVerses: 30,
    virtueArabic: 'المانعة والمنجية من عذاب القبر، وتعدل قراءتها كل ليلة ثواباً عظيماً وشفاعة لصاحبها.',
    virtueEnglish: 'The protector and savior from the punishment of the grave; intercedes for its reader nightly.',
    arabicText: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿١﴾ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ ﴿٢﴾',
      'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ ﴿٣﴾ ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنْقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ ﴿٤﴾',
      'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِلشَّيَاطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ ﴿٥﴾',
      'إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُمْ بِالْغَيْبِ لَهُمْ مَغْفِرَةٌ وَأَجْرٌ كَبِيرٌ ﴿١٢﴾ وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ ﴿١٣﴾ أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ ﴿١٤﴾',
      'هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِنْ رِزْقِهِ وَإِلَيْهِ النُّشُورُ ﴿١٥﴾',
      'قُلْ هُوَ الَّذِي أَنْشَأَكُمْ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ قَلِيلًا مَا تَشْكُرُونَ ﴿٢٣﴾ قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ ﴿٢٤﴾',
      'قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَنْ يَأْتِيكُمْ بِمَاءٍ مَعِينٍ ﴿٣٠﴾',
    ],
  },
];

export const DAILY_ATHKAR_LIST: DhikrItem[] = [
  // 1. WAKING UP ATHKAR (أذكار الاستيقاظ)
  {
    id: 'dhikr_wake_1',
    category: 'waking',
    title: {
      ar: 'الحمد لله الذي أحيانا',
      en: 'Praise be to Allah Who gave us life',
      fr: 'Louange à Allah Qui nous a rendu la vie',
    },
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.',
    translation: {
      en: 'All praise is for Allah Who gave us life after having taken it from us, and unto Him is the resurrection.',
      fr: 'Louange à Allah Qui nous a rendu la vie après nous avoir fait mourir, et vers Lui est la résurrection.',
    },
    repeatCount: 1,
    rewardOrVirtue: {
      ar: 'سنة نبوية شريفة عند فتح العينين لبدء اليوم بشكر المنعم.',
      en: 'Sunnah upon waking up to initiate the day with gratitude to Allah.',
      fr: 'Sunnah au réveil pour débuter la journée par la gratitude.',
    },
  },
  {
    id: 'dhikr_wake_2',
    category: 'waking',
    title: {
      ar: 'الحمد لله الذي عافاني في جسدي',
      en: 'Praise be to Allah Who restored my health',
      fr: 'Louange à Allah Qui a préservé ma santé',
    },
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ.',
    translation: {
      en: 'Praise is to Allah Who gave strength to my body, returned my soul to me, and permitted me to remember Him.',
      fr: 'Louange à Allah Qui a préservé mon corps, m’a rendu mon âme et m’a permis de L’évoquer.',
    },
    repeatCount: 1,
  },
  {
    id: 'dhikr_wake_3',
    category: 'waking',
    title: {
      ar: 'التهليل والتوحيد عند الاستيقاظ',
      en: 'Tawheed Upon Waking',
      fr: 'Unicité au Réveil',
    },
    arabicText: 'لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلا إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ.',
    translation: {
      en: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise...',
      fr: 'Nulle divinité n’est digne d’être adorée en dehors d’Allah, Seul sans associé...',
    },
    repeatCount: 1,
  },

  // 2. MORNING ATHKAR (أذكار الصباح)
  {
    id: 'dhikr_morn_kursi',
    category: 'morning',
    title: {
      ar: 'آية الكرسي',
      en: 'Ayat Al-Kursi (The Throne Verse)',
      fr: 'Ayat Al-Kursi (Le Verset du Trône)',
    },
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.',
    translation: {
      en: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
      fr: 'Allah ! Nulle divinité digne d’adoration autre que Lui, le Vivant, Celui qui subsiste par Lui-même...',
    },
    repeatCount: 1,
    rewardOrVirtue: {
      ar: 'من قرأها حين يصبح أُجير من الجن والشياطين حتى يمسي.',
      en: 'Whoever recites it in the morning is protected until evening.',
      fr: 'Quiconque la récite le matin est protégé jusqu’au soir.',
    },
  },
  {
    id: 'dhikr_morn_muawidhat',
    category: 'morning',
    title: {
      ar: 'سورة الإخلاص والمعوذتان',
      en: 'Al-Ikhlas, Al-Falaq, & An-Nas (3 times)',
      fr: 'Al-Ikhlas, Al-Falaq & An-Nas (3 fois)',
    },
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۞ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ قُلْ أَعُوذُ بِرَبِّ النَّاسِ.',
    translation: {
      en: 'Surah Al-Ikhlas, Al-Falaq, and An-Nas (Recite each 3 times).',
      fr: 'Sourate Al-Ikhlas, Al-Falaq et An-Nas (Réciter 3 fois chacune).',
    },
    repeatCount: 3,
    rewardOrVirtue: {
      ar: 'تكفيك من كل شيء وتحفظك من كل سوء طوال النهار.',
      en: 'Suffices you against everything and protects from all harm.',
      fr: 'Suffit contre tout mal et protège toute la journée.',
    },
  },
  {
    id: 'dhikr_morn_sayyid',
    category: 'morning',
    title: {
      ar: 'سيد الاستغفار',
      en: 'Master of Seeking Forgiveness',
      fr: 'Le Maître du Pardon (Sayyid Al-Istighfar)',
    },
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ.',
    translation: {
      en: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant...',
      fr: 'Ô Allah, Tu es mon Seigneur, nulle divinité sauf Toi. Tu m’as créé et je suis Ton serviteur...',
    },
    repeatCount: 1,
    rewardOrVirtue: {
      ar: 'من قالها موقناً بها حين يصبح فمات من يومه دخل الجنة.',
      en: 'Whoever says this with conviction in the morning and dies that day enters Paradise.',
      fr: 'Quiconque la dit avec conviction le matin et meurt ce jour entre au Paradis.',
    },
  },
  {
    id: 'dhikr_morn_asbahna',
    category: 'morning',
    title: {
      ar: 'أصبحنا وأصبح الملك لله',
      en: 'We have reached the morning and sovereignty belongs to Allah',
      fr: 'Nous voici au matin et la royauté appartient à Allah',
    },
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    translation: {
      en: 'We have entered the morning and the kingdom belongs to Allah, and all praise is for Allah...',
      fr: 'Nous voici au matin et la royauté appartient à Allah, et la louange est à Allah...',
    },
    repeatCount: 1,
  },
  {
    id: 'dhikr_morn_bismillah',
    category: 'morning',
    title: {
      ar: 'بسم الله الذي لا يضر مع اسمه شيء',
      en: 'In the Name of Allah with Whose Name nothing can harm',
      fr: 'Au nom d’Allah nul ne peut nuire avec Son Nom',
    },
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    translation: {
      en: 'In the name of Allah, with whose name nothing can cause harm on earth or in the heavens...',
      fr: 'Au nom d’Allah dont le nom empêche tout mal sur terre et au ciel...',
    },
    repeatCount: 3,
    rewardOrVirtue: {
      ar: 'لم يضره شيء طوال يومه.',
      en: 'Nothing will harm the reciter throughout the day.',
      fr: 'Rien ne lui nuira tout au long de sa journée.',
    },
  },
  {
    id: 'dhikr_morn_raditu',
    category: 'morning',
    title: {
      ar: 'رضيت بالله رباً',
      en: 'I am pleased with Allah as my Lord',
      fr: 'J’agrée Allah pour Seigneur',
    },
    arabicText: 'رَضِيتُ بِاللَّهِ رَبّاً، وَبِالإِسْلامِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.',
    translation: {
      en: 'I am pleased with Allah as my Lord, with Islam as my religion and with Muhammad as my Prophet.',
      fr: 'J’ai agréé Allah comme Seigneur, l’Islam comme religion et Muhammad comme Prophète.',
    },
    repeatCount: 3,
    rewardOrVirtue: {
      ar: 'كان حقاً على الله أن يرضيه يوم القيامة.',
      en: 'Allah has promised to please the reciter on the Day of Resurrection.',
      fr: 'Allah s’est engagé à le satisfaire le Jour du Jugement.',
    },
  },
  {
    id: 'dhikr_morn_subhan_100',
    category: 'morning',
    title: {
      ar: 'سبحان الله وبحمده (100 مرة)',
      en: 'Subhan-Allahi wa bihamdih (100 times)',
      fr: 'Subhan-Allahi wa bihamdih (100 fois)',
    },
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
    translation: {
      en: 'Glory be to Allah and all praise is due to Him (100 times).',
      fr: 'Gloire et louange à Allah (100 fois).',
    },
    repeatCount: 100,
    rewardOrVirtue: {
      ar: 'حُطّت خطاياه وإن كانت مثل زبد البحر، ولم يأت أحد بأفضل منه يوم القيامة.',
      en: 'His sins will be forgiven even if like the foam of the sea.',
      fr: 'Ses péchés sont effacés même s’ils sont comme l’écume de la mer.',
    },
  },

  // 3. EVENING ATHKAR (أذكار المساء)
  {
    id: 'dhikr_eve_kursi',
    category: 'evening',
    title: {
      ar: 'آية الكرسي في المساء',
      en: 'Ayat Al-Kursi at Evening',
      fr: 'Ayat Al-Kursi au Soir',
    },
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.',
    translation: {
      en: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
      fr: 'Allah ! Nulle divinité digne d’adoration autre que Lui...',
    },
    repeatCount: 1,
  },
  {
    id: 'dhikr_eve_amsayna',
    category: 'evening',
    title: {
      ar: 'أمسينا وأمسى الملك لله',
      en: 'We have reached the evening and sovereignty belongs to Allah',
      fr: 'Nous voici au soir et la royauté appartient à Allah',
    },
    arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    translation: {
      en: 'We have entered the evening and the kingdom belongs to Allah, and all praise is for Allah...',
      fr: 'Nous voici au soir et la royauté appartient à Allah...',
    },
    repeatCount: 1,
  },
  {
    id: 'dhikr_eve_sayyid',
    category: 'evening',
    title: {
      ar: 'سيد الاستغفار في المساء',
      en: 'Master of Forgiveness at Evening',
      fr: 'Sayyid Al-Istighfar au Soir',
    },
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ.',
    translation: {
      en: 'O Allah, You are my Lord, there is no god but You...',
      fr: 'Ô Allah, Tu es mon Seigneur, nulle divinité sauf Toi...',
    },
    repeatCount: 1,
  },
  {
    id: 'dhikr_eve_aoodhu',
    category: 'evening',
    title: {
      ar: 'أعوذ بكلمات الله التامات',
      en: 'I seek refuge in the Perfect Words of Allah',
      fr: 'Je cherche refuge auprès des paroles parfaites d’Allah',
    },
    arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    translation: {
      en: 'I seek refuge in the perfect words of Allah from the evil of what He has created (3 times).',
      fr: 'Je cherche protection auprès des paroles parfaites d’Allah contre le mal de ce qu’Il a créé (3 fois).',
    },
    repeatCount: 3,
    rewardOrVirtue: {
      ar: 'حماية وحصن من كل لدغة أو ضرر أو حمة في تلك الليلة.',
      en: 'Protection from venomous stings and harm throughout the night.',
      fr: 'Protection contre tout poison et malheur durant la nuit.',
    },
  },
  {
    id: 'dhikr_eve_bismillah',
    category: 'evening',
    title: {
      ar: 'بسم الله الذي لا يضر مع اسمه شيء',
      en: 'In the Name of Allah (Evening)',
      fr: 'Au nom d’Allah (Soir)',
    },
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    translation: {
      en: 'In the name of Allah, with whose name nothing can cause harm on earth or in the heavens (3 times).',
      fr: 'Au nom d’Allah dont le nom empêche tout mal sur terre et au ciel (3 fois).',
    },
    repeatCount: 3,
  },
  {
    id: 'dhikr_eve_istighfar_100',
    category: 'evening',
    title: {
      ar: 'أستغفر الله وأتوب إليه (100 مرة)',
      en: 'Astaghfirullah wa atoobu ilayh (100 times)',
      fr: 'Astaghfirullah wa atoobu ilayh (100 fois)',
    },
    arabicText: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.',
    translation: {
      en: 'I seek Allah’s forgiveness and turn to Him in repentance (100 times).',
      fr: 'Je demande pardon à Allah et je me repens à Lui (100 fois).',
    },
    repeatCount: 100,
  },

  // 4. SLEEPING ATHKAR (أذكار النوم)
  {
    id: 'dhikr_sleep_kursi',
    category: 'sleeping',
    title: {
      ar: 'آية الكرسي قبل النوم',
      en: 'Ayat Al-Kursi Before Sleep',
      fr: 'Ayat Al-Kursi Avant de Dormir',
    },
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ...',
    translation: {
      en: 'Recite Ayat Al-Kursi before resting on your bed.',
      fr: 'Réciter le verset du Trône avant de dormir.',
    },
    repeatCount: 1,
    rewardOrVirtue: {
      ar: 'لا يزال عليك من الله حافظ ولا يقربك شيطان حتى تصبح.',
      en: 'A guardian angel protects you from Allah, and no devil can approach you until morning.',
      fr: 'Un ange gardien vous protège et aucun diable ne vous approche jusqu’au matin.',
    },
  },
  {
    id: 'dhikr_sleep_baqarah',
    category: 'sleeping',
    title: {
      ar: 'خواتيم سورة البقرة',
      en: 'Last Two Verses of Surah Al-Baqarah',
      fr: 'Les Deux Derniers Versets de la Sourate Al-Baqarah',
    },
    arabicText: 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ﴿٢٨٥﴾ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ ﴿٢٨٦﴾',
    translation: {
      en: 'The Messenger has believed in what was revealed to him from his Lord, and so have the believers...',
      fr: 'Le Messager a cru en ce qu’on a fait descendre vers lui venant de son Seigneur...',
    },
    repeatCount: 1,
    rewardOrVirtue: {
      ar: 'من قرأهما في ليلة كفتاه من كل شر وسوء.',
      en: 'Whoever recites them at night, they will be sufficient for him.',
      fr: 'Quiconque les récite la nuit, elles lui suffisent contre tout mal.',
    },
  },
  {
    id: 'dhikr_sleep_bismika',
    category: 'sleeping',
    title: {
      ar: 'باسمك ربي وضعت جنبي',
      en: 'In Your name my Lord, I lie down',
      fr: 'En Ton nom Seigneur je me couche',
    },
    arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.',
    translation: {
      en: 'In Your name my Lord, I lie down and in Your name I rise up...',
      fr: 'En Ton nom mon Seigneur, je pose mon flanc et en Ton nom je le relève...',
    },
    repeatCount: 1,
  },
  {
    id: 'dhikr_sleep_tasbih',
    category: 'sleeping',
    title: {
      ar: 'تسبيح فاطمة (33 سبحان الله، 33 الحمد لله، 34 الله أكبر)',
      en: 'Tasbih Fatima (33x Subhanallah, 33x Alhamdulillah, 34x Allahu Akbar)',
      fr: 'Tasbih de Fatima (33x, 33x, 34x)',
    },
    arabicText: 'سُبْحَانَ اللَّهِ (٣٣) ، الْحَمْدُ لِلَّهِ (٣٣) ، اللَّهُ أَكْبَرُ (٣٤).',
    translation: {
      en: 'Glory be to Allah (33), Praise be to Allah (33), Allah is the Greatest (34).',
      fr: 'Gloire à Allah (33), Louange à Allah (33), Allah est le Plus Grand (34).',
    },
    repeatCount: 33,
    rewardOrVirtue: {
      ar: 'وصية النبي ﷺ لفاطمة وعلي رضي الله عنهما؛ خير لهما من خادم وتمنح طاقة ونشاطاً للجسم.',
      en: 'Better than a servant, giving strength and energy for the next day.',
      fr: 'Meilleur qu’un serviteur, procure vitalité et sérénité.',
    },
  },
  {
    id: 'dhikr_sleep_aslamtu',
    category: 'sleeping',
    title: {
      ar: 'اللهم أسلمت نفسي إليك',
      en: 'O Allah, I have submitted myself to You',
      fr: 'Ô Allah, je me suis soumis à Toi',
    },
    arabicText: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لا مَلْجَأَ وَلا مَنْجَا مِنْكَ إِلاَّ إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.',
    translation: {
      en: 'O Allah, I surrender my soul unto You, entrust my affairs unto You, and turn my face toward You...',
      fr: 'Ô Allah, je Te soumets mon âme, je Te confie mon sort, et je tourne mon visage vers Toi...',
    },
    repeatCount: 1,
    rewardOrVirtue: {
      ar: 'اجعلهن آخر ما تقول؛ فإن متّ من ليلتك متّ على الفطرة.',
      en: 'Make it the last supplication before sleep; if you pass away that night, you die on the natural faith (Fitrah).',
      fr: 'Que ce soit la dernière parole avant de dormir; si vous mourrez, vous mourrez sur la Fitrah.',
    },
  },
];

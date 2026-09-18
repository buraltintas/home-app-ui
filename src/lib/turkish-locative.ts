// "İzmir'de", not "İzmir'da".
//
// The first version of the city pages wrote "'da" after every city, which is right for
// Antalya and wrong for İzmir, Kayseri, Denizli, Eskişehir, Edirne, Gaziantep and most of the
// rest. The fix is not a list of cities -- this product covers every one of them and a list
// would be wrong the moment a name nobody thought of turned up. Turkish already has the rule,
// and it is short:
//
//   1. The suffix takes its vowel from the last vowel of the word. a, ı, o, u take "a";
//      e, i, ö, ü take "e".
//   2. It takes its consonant from the last letter. After a voiceless consonant it hardens to
//      "t"; otherwise it stays "d".
//   3. A proper noun is separated from it by an apostrophe.
//
// So: İzmir'de, İstanbul'da, Gaziantep'te, Uşak'ta, Muğla'da, Tekirdağ'da, Bilecik'te.
const BACK_VOWELS='aıouâû';
const FRONT_VOWELS='eiöü';
// The consonants Turkish calls sert: after one of these the suffix hardens.
const VOICELESS='fstkçşhp';

export function locative(name:string):string{
  const word=name.trim();
  if(!word)return word;
  const lower=word.toLocaleLowerCase('tr');
  let vowel='';
  for(let index=lower.length-1;index>=0;index--){
    const letter=lower[index];
    if(BACK_VOWELS.includes(letter)){vowel='a';break;}
    if(FRONT_VOWELS.includes(letter)){vowel='e';break;}
  }
  // A name with no vowel at all cannot be inflected, and guessing one would be worse than
  // saying the name plainly.
  if(!vowel)return word;
  const consonant=VOICELESS.includes(lower[lower.length-1])?'t':'d';
  return `${word}’${consonant}${vowel}`;
}

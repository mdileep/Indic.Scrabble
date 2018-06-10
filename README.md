# Indic Scrabble 

*Scrabble* is a popular word game originally designed for *English*. Later it was adopted in many other languages.This an attempt to bring the Scrabble like game to Indian Languages targeted to work on mobiles and tablets.

## Dynamic Nature of Scripts

* Scripts of Indic Languages are dynamic in nature i.e. characters(or letters)  assume new display form (Glyph)  based on the context.
* For an instance *Telugu* is a South Indian Language which has around *100milion* native speakers.
* It consists of 16 vowels and 38 Consonants and 2 Modifiers i.e. Total 56 Letters.
* When a Consonant combined with a vowel it takes a new glyph form i.e. 38*16 = 608 Glyphs
* Each Consonant also has a subscript form i.e. additional 38 Glyphs
* The subscript form is assumed by a consonant when it is combined with another consonant.
* Roughly atleast 56 + 608 + 38 = 702 Glyphs (or Tiles) are needed to build Scrabble like game for Telugu (or for any other Indian Languages) with  frequency of one tile for each glyph. 

## Rules

* Syllable (Aksharam) is the writing unit for Indic Languages. A Syllable is a combination of Letters/Chars.
* Logically and Linguistically it makes sense to place a valid Syllable on the Board Cell(or Square). 
* When we say that a valid Syllable can only be placed on board then it increases the no. of tiles needed. This number is theoretically *infinite*. But ususally be thousand's only in real.
* Hence I came up with following rules or exceptions for *Indic Scrabble*. 
    * A tile placed on the board can be *altered* by adding new *tile(s)* to form a new Syllable.
    * Total of 16 tiles would be used with 8 Consonants and 8 Vowels + Modifiers. Combining Consonants with Vowels and Modifiers is very frequent and in fact most of the syllables ends with one of the vowels or modifiers.

## Languages

* Telugu
* Kannada
* Hindi (Devanagari Script)
* Sinhala
* Other Languages (Immediate Targets)
    * Nepali
    * Tamil
    * Punjabi
    * Gujarati

## Bots and Vocabularies

* AI based Agents are planned. Current Bot Intelligence is State based.
* Current Bots have the same level of intelligence but have different levels of vocabulries.
* Bots uses the browser resources to think But it is possible to configure bots to have their own intelligence (Remote/in-memory etc).
* Average response time of the Bot to select a move is between 80ms to 8sec. Bots take more time as the size of vocabulary and state of the board.
* Current Framework uses *Regular Expressions* to shortlist the words.
* Vocabulary source is pre-complied in to tile format.
* Currently Telugu has 9 Bots , Kananada has 3 Bots  and Hindi has 2 Bots.
* Bots were named after the source of vocabulary.
* Bots: Telugu:
    * ఆంధ్రభారతి 
    * పోతన      
    * ఈనాడు     
    * బీబీసీ        
    * బైబిలు        
    * ఆంధ్రజ్యోతి
    * కినిగె
    * వసారా
    * వీవెనుడు
* Bots: Kannada:
    * ವಿಜಯ
    * ಉದಯವಾಣಿ
    * ಬೈಬಲ್
* Bots: Hindi
    * बीबीसी
    * बाइबिल

## Technologies

*  The game designed to work on a browser with no or minimum server round trips.
*  ASP.NET (C#.NET) as the Server Language but any other language can also be used. Python is my personal choice for porting.
*  JavaScript/Typescript(version 1.8).
*  React(version 15.0.0) with Redux.

## Demo
    http://indicscrabble.apphb.com/
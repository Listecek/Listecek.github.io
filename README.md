# Minesweeper

## Cíl projektu
Cílem tohoto projektu je vytvořit klasickou hru Minesweeper. Hra by měla obsahovat různé úrovně obtížnosti, možnost nastavení vlastní obtížnosti, export a import herního stavu, zvukové efekty a jednoduché animace.

## Pravidla hry
Minesweeper je logická hra, při které je cílem hráče odhalit všechny políčka, která neobsahují miny.
Políčka jsou označena počty okolních min (0-8). Hráč pomocí těchto počtů může odvodit, která políčka obsahují miny a označit je vlaječkou.

- **Obtížnosti**: Hra obsahuje tři základní úrovně obtížnosti (začátečník, středně pokročilý, expert) a možnost nastavení vlastní obtížnosti.
- **První kliknutí**: První kliknutí nikdy neodhalí minu.
- **Odhalování políček**: Kliknutím levým tlačítkem myši odhalíte políčko. Pokud políčko obsahuje minu, hra končí. Pokud políčko obsahuje číslo, toto číslo reprezentuje počet min v sousedních políčkách. Kliknutím pravým tlačítkem myši můžete políčko označit vlaječkou.
- **Odhalování políček pokročilé**: Kliknutím na políčko s číslem, které má v sousedních políčkách takový počet označených vlaječek, se automaticky odhalí všechna okolní políčka neoznačená vlaječkami. **POZOR:** Lze takto odhalit i minu, pokud jsou vlaječky označeny špatně.
- **Přepínání módu odhalování políček**: Lze přepínat funkcionalitu levého tlačítka myši pomocí tlačítka "Flag" a "Mine".
- **Výhra**: Hráč vyhrává, když odhalí všechna políčka, která neobsahují miny.

## Postup implementace
1. **Nastavení projektu**: Vytvoření základní struktury HTML dokumentu a souborů pro CSS a JavaScript.
2. **Vytvoření hracího pole pomocí JS**: Vytvoření hracího pole podle parametrů zvolené obtížnosti.
3. **Herní logika**: Implementace logiky hry v JS, včetně umístění min, výpočtu okolních min, odhalování políček a kontroly vítězství/prohry.
4. **Styling a rozložení**: Navržení vzhledu hry pomocí CSS, včetně responzivního designu.
5. **Časovač**: Přidání časovače, který měří dobu trvání hry.
6. **Zvukové efekty**: Implementace zvukových efektů (odhalení miny, vítězství, hudba v pozadí).
7. **Animace**: Přidání animace ohňostrojů při vítězství a výbuchu při prohře.
8. **Herní stav**: Implementace uložení herního stavu pro možnost přepínání historie.
9. **Export a import herního stavu**: Přidání možnosti exportu a importu herního stavu pomocí LocalStorage a souborů.

## Popis funkčnosti
- **Herní pole**: Generuje se dynamicky na základě zvolené obtížnosti. Každé políčko může obsahovat minu, číslo nebo být prázdné.
- **Vlastní obtížnost**: Po kliknutí na tlačítko "Custom" a vyplnění formuláře parametrů hry se vygeneruje hrací pole podle zadaných parametrů.
- **Časovač**: Spouští se při prvním kliknutí a měří čas až do konce hry (výhra/prohra).
- **Zvukové efekty**: Při různých akcích se přehrají zvukové efekty (např. dokončení hry, tlačítko hudby).
- **Animace ohňostrojů**: Při výhře se na herním poli zobrazí SVG animace ohňostrojů.
- **Animace výbuchu**: Při prohře se na herním poli zobrazí CSS animace výbuchu.
- **Uložení stavu hracího pole**: Po každém tahu si prohlížeč uloží herní stav pomocí LocalStorage API. Tyto herní stavy lze navigovat pomocí tlačítek zpět a vpřed.
- **Export a import herního stavu**: Umožňuje hráčům uložit aktuální stav hry a později jej znovu načíst ve formátu JSON.

Tato dokumentace poskytuje přehled o cílech, pravidlech, implementačních krocích a funkčnostech projektu Minesweeper. Je určena pro vývojáře a zájemce o podrobnosti týkající se vývoje a fungování této hry.

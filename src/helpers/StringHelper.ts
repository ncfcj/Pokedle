export class StringHelper {
    public static CapitalizeFirstLetter = (word : string) => {
        if (word == undefined || word == "" || word == " ")
            return "";

        const firstLetter = word[0].toUpperCase();
        const restOfWord = word.slice(1);

        return firstLetter + restOfWord;
    }
}
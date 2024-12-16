import axios from "axios";

export async function GenPara(): Promise<string[]> {
    try{
        const res = await axios.get("https://random-word-api.herokuapp.com/word?number=50")
        const para = res.data
        return para
    }
    catch(err) {
        console.log(err)
        return "Error Generating Paragraph".split(" ");
    }
}

export const wordList = await GenPara()

export type GameState = "init" | "end" | "inProgress";

export const FunctionKeys = ["Shift", "Control", "Alt", "CapsLock", "Enter", "Escape"];


// const para = "A country with a rich heritage and many cultures, India is the second most populated country in the world. It is home to the Bengal tiger, the national animal, and the peacock, the national bird. The national song is Vande Matram, and the national anthem is Jana Gana Mana. The national flag, Tiranga, is made up of three colors: saffron, white, and green."

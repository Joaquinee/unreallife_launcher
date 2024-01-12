import { clipboard } from "electron"

export default {

    copyToClipBoard: (text: string) => {
        clipboard.writeText(text);
        return text;
    },
   
    



}
import { dialog } from "@tauri-apps/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default function pdfPlugin() {

    return {
        actions: [
            {
                title: "test",
                icon: "test",
                cheatsheet: "$".concat('test', "$"),
                handler: {
                    type: 'action',
                    click: ({editor, root}) => {
                        let dom = root.querySelector(".bytemd-preview");
                        html2canvas(dom)
                          .then(canvas => {
                            let url = canvas.toDataURL();
                          })
                        console.log("test plugin======", );
                        editor.focus();
                    }
                }
            },
        ]
    };
}

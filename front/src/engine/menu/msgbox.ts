import { Menu } from ".";
import { MenuManager } from "./menumanager";
import { Alignment, Style, SSManager } from "../utils";
import { TextBox } from "./textbox";
import { Button } from "./button";
import { Img } from "../../utils";
import { CoverShape } from "./covershape";

export class MessageBox {
    private menu: Menu;

    constructor(message: string[], w: number, h: number, a: Alignment = Alignment.LEFT, s: Style = Style.FILL) {
        const mss = SSManager.get(Img.BUTTONS, 5, 3);
        this.menu = MenuManager.createMenu(666);
        this.menu.setBackground('#FFA500FF');
        this.menu.setSizeXY(w, h);
        this.menu.setAlignedMiddle();

        const backshape = new CoverShape('#E3911EFF').setCentered(true).relativeTo(this.menu);
        backshape.setSizeXY(w - 20, h - 20);
        backshape.setAlignedMiddle();
        this.menu.add(backshape);
        
        const text = new TextBox(message, a, s).relativeTo(this.menu);
        text.setAlignedMiddle();
        text.translateXY(0, 20);
        this.menu.add(text);

        const closebtn = new Button(mss.getSprite(0, 0)).relativeTo(this.menu);
        closebtn.setPositionXY(-35, 35);
        closebtn.onClick(() => {
            this.menu.setVisible(false);
        });
        this.menu.add(closebtn);
    }

    public isVisible(): boolean {
        return this.menu.isVisible();
    }

    public toggle(): void {
        console.log("called");
        this.menu.toggle();
    }

    public display(): void {
        this.menu.setVisible(true);
    }

    public hide(): void {
        this.menu.setVisible(false);
    }

}
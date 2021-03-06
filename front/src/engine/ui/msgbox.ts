import { Img } from "../res/assetsManager";
import { Alignment, Style } from "../utils/textFormat";
import { SSManager } from "../utils/spritesheet";
import { Menu } from "./menu";
import { MenuManager } from "./menumanager";
import { CoverShape } from "./covershape";
import { TextBox } from "./textbox";
import { Button } from "./button";

export class MessageBox {
    private menu: Menu;

    constructor(message: string[], w: number, h: number, size: number = 42, a: Alignment = Alignment.LEFT, s: Style = Style.FILL) {
        const mss = SSManager.get(Img.BUTTONS, 3, 5);
        this.menu = MenuManager.createMenu(666);
        this.menu.setSizeXY(w + 10, h + 10);
        this.menu.setAlignedMiddle();

        const backshape0 = new CoverShape('#FFFFFFFF').rounded(60).setCentered(true).relativeTo(this.menu);
        backshape0.setSizeXY(w, h);
        backshape0.setAlignedMiddle();
        this.menu.add(backshape0);

        const backshape1 = new CoverShape('#ffbd31FF').rounded(60).setCentered(true).relativeTo(this.menu);
        backshape1.setSizeXY(w - 10, h - 10);
        backshape1.setAlignedMiddle();
        this.menu.add(backshape1);
        
        const text = new TextBox(message, size, a, s).relativeTo(this.menu);
        text.setAlignedMiddle();
        text.translateXY(0, 20);
        this.menu.add(text);

        const closebtn = new Button(mss.getSprite(0, 0)).relativeTo(this.menu);
        closebtn.setPositionXY(-25, 25);
        closebtn.onClick(() => {
            this.menu.setVisible(false);
        });
        this.menu.add(closebtn);
    }

    public isVisible(): boolean {
        return this.menu.isVisible();
    }

    public toggle(): void {
        this.menu.toggle();
    }

    public display(): void {
        this.menu.setVisible(true);
    }

    public hide(): void {
        this.menu.setVisible(false);
    }

}
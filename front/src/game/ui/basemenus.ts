import { Menu, Button } from "../../engine/menu";
import { Vec2, SSManager } from "../../engine/utils";
import { MenuManager } from "../../engine/menu/menumanager";
import { Img } from "../../utils";

export const main_menu = MenuManager.createMenu();

export function init() {
    const mss = SSManager.get(Img.BUTTONS, 3, 3);
    //main_menu.setNoBackground();
    main_menu.setSize(new Vec2(600, 300));
    main_menu.setAlignedMiddle();

    const playButton = new Button(mss.getSprite(0, 0)).relativeTo(main_menu);
    playButton.setAlignedMiddle();

    main_menu.add(playButton);
}


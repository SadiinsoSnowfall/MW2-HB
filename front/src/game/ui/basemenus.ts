import { Button, CoverShape } from "../../engine/menu";
import { Vec2, SSManager } from "../../engine/utils";
import { MenuManager } from "../../engine/menu/menumanager";
import { Img, Assets } from "../../utils";

export const main_menu = MenuManager.createMenu();
export const sett_menu = MenuManager.createMenu();

export function init() {
    const mss = SSManager.get(Img.BUTTONS, 3, 3);

    /*
        MAIN MENU
    */

    //main_menu.setSize(new Vec2(600, 300));
    main_menu.setFullScreen();
    main_menu.setBackground(Assets.img(Img.SPLASH));
    main_menu.setAlignedMiddle();

    const playButton = new Button(mss.getSprite(0, 0)).relativeTo(main_menu);
    playButton.setAlignedMiddle();
    playButton.onClick(() => {
        console.log('clicked play');
    });

    main_menu.add(playButton);

    const playShape = new CoverShape("#FFA500D0").setCentered(true).relativeTo(main_menu);
    playShape.setSizeXY(250, 150);
    playShape.setAlignedMiddle();
    main_menu.add(playShape);

    const settings = new Button(mss.getSprite(2, 2)).relativeTo(main_menu);
    settings.setPositionXY(50, -50);
    settings.onClick(() => {
        console.log("clicked settings");
    });
    main_menu.add(settings);

    console.log(settings.getPosition());


    /*
        QUICK MENU
    */
   sett_menu.setSize(new Vec2(50, 50));


}


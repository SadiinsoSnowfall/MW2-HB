import { Button, CoverShape, MessageBox } from "../../engine/menu";
import { Vec2, SSManager, Alignment } from "../../engine/utils";
import { MenuManager } from "../../engine/menu/menumanager";
import { Img, Assets, Sound } from "../../utils";
import { AudioManager } from "../../engine/audioManager";

export const main_menu = MenuManager.createMenu();
export const sett_menu = MenuManager.createMenu();

export function init() {
    const mss = SSManager.get(Img.BUTTONS, 5, 3);
    const playbtnsprite = SSManager.get(Img.PLAYBTN, 1, 1).getSprite(0, 0);

    /*
        MAIN MENU
    */

    //main_menu.setSize(new Vec2(600, 300));
    main_menu.setFullScreen();
    main_menu.setBackground(Assets.img(Img.SPLASH));
    main_menu.setAlignedMiddle();

    let mainMenuMusic: HTMLAudioElement | null = null;

    main_menu.onDisplay(() => {
        if (mainMenuMusic == null) {
            mainMenuMusic = AudioManager.loop(Sound.MAIN_REMIX, 0.1, 50, 70.8);
        }
    });

    main_menu.onHide(() => {
        sett_menu.setVisible(false);
        if (mainMenuMusic != null) {
            mainMenuMusic.pause();
            mainMenuMusic = null;
        }
    });

    const playButton = new Button(playbtnsprite).relativeTo(main_menu);
    playButton.setAlignedMiddle();
    playButton.onClick(() => {
        console.log('clicked play');
        main_menu.setVisible(false);
    });

    main_menu.add(playButton);

    const playShape = new CoverShape("#FFA500D0").setCentered(true).relativeTo(main_menu);
    playShape.setSizeXY(250, 150);
    playShape.setAlignedMiddle();
    main_menu.add(playShape);

    const settings = new Button(mss.getSprite(1, 2)).relativeTo(main_menu);
    settings.setPositionXY(50, -50);
    settings.onClick(() => {
        sett_menu.toggle();
    });

    main_menu.add(settings);


    /*
        QUICK SETTINGS MENU (on main menu)
    */
    const info_msgbox = new MessageBox(["Master Weeb 2: Hungry Board", "", "", "(c) 2020 MAO Limited"], 700, 400, Alignment.CENTERED);

    sett_menu.setZIndex(2);
    sett_menu.setSizeXY(50, 150);
    sett_menu.setPositionXY(25, -240);
    sett_menu.setBackground('#696969BB');

    const sm_music = new Button(mss.getSprite(1, 4)).relativeTo(sett_menu);
    sm_music.setPositionXY(0, -35);
    sm_music.setAlignedMiddleX();
    sm_music.onClick(() => {
        console.log("music clicked");
    });

    sett_menu.add(sm_music);

    const sm_info = new Button(mss.getSprite(2, 2)).relativeTo(sett_menu);
    sm_info.setPositionXY(0, 35);
    sm_info.setAlignedMiddleX();
    sm_info.onClick(() => {
        info_msgbox.toggle();
    });

    sett_menu.add(sm_info);



}


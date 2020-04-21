import { MenuManager, Button, CoverShape, CoverImg, MessageBox } from "../../engine/ui";
import { SSManager, Alignment } from "../../engine/utils";
import { Img, Assets, Sound, AudioManager } from '../../engine/res';
import { Settings, DefaultSettings } from "../../engine/res/settingsManager";

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

    main_menu.onDisplay(async () => {
        if (mainMenuMusic == null) {
            mainMenuMusic = await AudioManager.loop(Sound.MAIN_REMIX, 0.1, 50, 70.8);
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
    sm_music.onClick(async () => {
        const state = await Settings.toggle(DefaultSettings.SOUND_ENABLED, false);
        if (state) {
            sm_music_overlay.setVisible(false);
            if (main_menu.isVisible() && (mainMenuMusic === null)) {
                mainMenuMusic = await AudioManager.loop(Sound.MAIN_REMIX, 0.1, 50, 70.8);
            }
        } else {
            sm_music_overlay.setVisible(true);
            if (mainMenuMusic != null) {
                mainMenuMusic.pause();
                mainMenuMusic = null;
            }
        }
    });

    sett_menu.add(sm_music);

    const sm_music_overlay = new CoverImg(mss.getSprite(1, 3));
    sm_music_overlay.centerOn(sm_music).setZIndex(2).setVisible(false);
    sett_menu.add(sm_music_overlay);    

    const sm_info = new Button(mss.getSprite(2, 2)).relativeTo(sett_menu);
    sm_info.setPositionXY(0, 35);
    sm_info.setAlignedMiddleX();
    sm_info.onClick(() => {
        info_msgbox.toggle();
    });

    sett_menu.add(sm_info);

}


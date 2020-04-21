import { MenuManager, Button, CoverShape, CoverImg, MessageBox, TextBox } from "../../engine/ui";
import { SSManager, Alignment } from "../../engine/utils";
import { Img, Assets, Sound, AudioManager, Levels } from '../../engine/res';
import { Settings, DefaultSettings } from "../../engine/res/settingsManager";
import { Scene } from "src/engine/scene";
import { del } from "idb-keyval";

export const main_menu = MenuManager.createMenu();
export const sett_menu = MenuManager.createMenu();
export const lvl_menu = MenuManager.createMenu();
export const ig_menu = MenuManager.createMenu();

let lvlQueryPromise: Promise<any> | undefined = undefined;
let currentLevel: number = 0;

export async function init(scene: Scene) {
    const mss = SSManager.get(Img.BUTTONS, 5, 3);
    const levelIcons = SSManager.get(Img.LEVELS_ICON, 3, 4);
    const playbtnsprite = SSManager.get(Img.PLAYBTN, 1, 1).getSprite(0, 0);

    /*
        MAIN MENU
    */

    //main_menu.setSize(new Vec2(600, 300));
    main_menu.setFullScreen();
    main_menu.setBackground(Assets.img(Img.SPLASH));

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
        lvl_menu.setVisible(true);
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
    sm_music_overlay.centerOn(sm_music).setZIndex(2).setVisible(!(await Settings.get(DefaultSettings.SOUND_ENABLED, true)));
    sett_menu.add(sm_music_overlay);    

    const sm_info = new Button(mss.getSprite(2, 2)).relativeTo(sett_menu);
    sm_info.setPositionXY(0, 35);
    sm_info.setAlignedMiddleX();
    sm_info.onClick(() => {
        info_msgbox.toggle();
    });

    sett_menu.add(sm_info);

    /*
        Level selection
    */

    lvl_menu.setFullScreen();
    lvl_menu.setBackground(Assets.img(Img.SPLASH));

    const lvl_back = new CoverShape("#A0A0A0DD").relativeTo(lvl_menu);
    lvl_back.setSizeXY(800, 800);
    lvl_back.setAlignedMiddle();
    lvl_menu.add(lvl_back);

    const lvl_title = new TextBox(["Sélection des niveaux"]).relativeTo(lvl_menu);
    lvl_title.setPositionXY(0, 250);
    lvl_title.setAlignedMiddleX();
    lvl_menu.add(lvl_title);

    const lvl_btn_back = new Button(mss.getSprite(2, 1)).relativeTo(lvl_menu);
    lvl_btn_back.setPositionXY(50, -50);
    lvl_btn_back.onClick(() => {
        main_menu.setVisible(true);
        lvl_menu.setVisible(false);
    });
    lvl_menu.add(lvl_btn_back);

    Levels.getOrQueryLevelList().then(levels => {
        const baseX = 660;
        const baseY = 350;
        const dx = 150;
        const dy = 130;
        let cx = 0;
        let cy = 0;

        for (const level of levels) {
            const nbtn = new Button(levelIcons.getSprite(0, 0));
            nbtn.setPositionXY(cx + baseX, cy + baseY);
            nbtn.onClick(async () => {
                currentLevel = level.id;
                await Levels.loadLevel(level.id, scene);
                lvl_menu.setVisible(false);
                ig_menu.setVisible(true);
            });

            lvl_menu.add(nbtn);

            const tbox = new TextBox([`${level.id}`]);
            tbox.centerOn(nbtn);
            tbox.translateXY(0, 40);
            lvl_menu.add(tbox);

            cx += dx;
            if (cx >= dx * 5) {
                cx = 0;
                cy += dy;
            }
        }
    });

    /*
        In game menu
    */

    ig_menu.setPositionXY(0, -80);
    ig_menu.setSizeXY(300, 80);

    const ig_settings = new Button(mss.getSprite(1, 2)).relativeTo(ig_menu);
    ig_settings.setPositionXY(50, -50);
    ig_settings.onClick(() => {
        sett_menu.toggle();
    });
    ig_menu.add(ig_settings);

    const ig_back = new Button(mss.getSprite(0, 2)).relativeTo(ig_menu);
    ig_back.setPositionXY(120, -50);
    ig_back.onClick(() => {
        scene.clear();
        sett_menu.setVisible(false);
        ig_menu.setVisible(false);
        lvl_menu.setVisible(true);
    });
    ig_menu.add(ig_back);

    const ig_reload = new Button(mss.getSprite(2, 0)).relativeTo(ig_menu);
    ig_reload.setPositionXY(190, -50);
    ig_reload.onClick(() => {
        scene.clear();
        Levels.loadLevel(currentLevel, scene);
    });
    ig_menu.add(ig_reload);

}


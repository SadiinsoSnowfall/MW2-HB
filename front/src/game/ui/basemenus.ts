import { Settings, DefaultSettings } from "../../engine/res/settingsManager";
import { Scene } from "../../engine/scene";
import { Img, Assets, Sound } from "../../engine/res/assetsManager";
import { AudioManager } from "../../engine/res/audioManager";
import { Levels } from "../../engine/res/levelsManager";
import { SSManager } from "../../engine/utils/spritesheet";
import { Alignment } from "../../engine/utils/textFormat";
import { MenuManager } from "../../engine/ui/menumanager";
import { Button } from "../../engine/ui/button";
import { CoverImg } from "../../engine/ui/coverimg";
import { MessageBox } from "../../engine/ui/msgbox";
import { CoverShape } from "../../engine/ui/covershape";
import { TextBox } from "../../engine/ui/textbox";

export const main_menu = MenuManager.createMenu();
export const sett_menu = MenuManager.createMenu();
export const lvl_menu = MenuManager.createMenu();
export const ig_menu = MenuManager.createMenu();

let lvlQueryPromise: Promise<any> | undefined = undefined;
let currentLevel: number = 0;

export async function init(scene: Scene) {
    const mss = SSManager.get(Img.BUTTONS, 3, 5);
    const levelIcons = SSManager.get(Img.LEVELS_ICON, 4, 3);
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
        if (mainMenuMusic != null && !lvl_menu.isVisible()) {
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

    const playShape = new CoverImg(SSManager.get(Img.PLAY_BSHAPE, 1, 1).getSprite(0, 0)).setCentered(true).scale(1.2).relativeTo(main_menu);
    //playShape.setSizeXY(250, 150);
    playShape.setAlignedMiddle();
    main_menu.add(playShape);

    const mm_settings = new Button(mss.getSprite(1, 2)).relativeTo(main_menu);
    mm_settings.setPositionXY(50, -50);
    mm_settings.onClick(() => {
        sett_menu.toggle();
    });
    main_menu.add(mm_settings);


    /*
        QUICK SETTINGS MENU (on main menu)
    */

    const info_msgbox = new MessageBox([
        "Master Weeb 2:", 
        "Hungry Board", 
        "",
        "(c) 2020 MAO Limited",
        "",
        "All assets created and owned",
        "by Rovio Entertainment Ltd"
    ], 700, 450, Alignment.CENTERED);

    sett_menu.setZIndex(2);
    sett_menu.setSizeXY(50, 150);
    sett_menu.setPositionXY(25, -240);
    //sett_menu.setBackground('#696969BB');

    const sett_back = new CoverShape("#696969BB").rounded(30).relativeTo(sett_menu);
    sett_back.setSizeXY(50, 150);
    sett_back.setPositionXY(0, 76);
    sett_back.setAlignedMiddleX();
    sett_menu.add(sett_back);

    const sm_music = new Button(mss.getSprite(1, 4)).relativeTo(sett_menu);
    sm_music.setPositionXY(0, -35);
    sm_music.setAlignedMiddleX();
    sm_music.onClick(async () => {
        const state = await Settings.toggle(DefaultSettings.SOUND_ENABLED, false);
        if (state) {
            sm_music_overlay.setVisible(false);
            if ((main_menu.isVisible() || lvl_menu.isVisible()) && (mainMenuMusic === null)) {
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

    const lvl_back = new CoverShape("#FFFFFFFF").rounded(30).relativeTo(lvl_menu);
    lvl_back.setSizeXY(810, 810);
    lvl_back.setAlignedMiddle();
    lvl_menu.add(lvl_back);

    const lvl_front = new CoverShape("#ffbd31FF").rounded(30).relativeTo(lvl_menu);
    lvl_front.setSizeXY(800, 800);
    lvl_front.setAlignedMiddle();
    lvl_menu.add(lvl_front);

    const lvl_title = new TextBox(["Sélection des niveaux"]).relativeTo(lvl_menu);
    lvl_title.setPositionXY(0, 250);
    lvl_title.setAlignedMiddleX();
    lvl_menu.add(lvl_title);

    const lvl_settings = new Button(mss.getSprite(1, 2)).relativeTo(main_menu);
    lvl_settings.setPositionXY(50, -50);
    lvl_settings.onClick(() => {
        sett_menu.toggle();
    });
    lvl_menu.add(lvl_settings);

    const lvl_btn_back = new Button(mss.getSprite(2, 1)).relativeTo(lvl_menu);
    lvl_btn_back.setPositionXY(120, -50);
    lvl_btn_back.onClick(() => {
        main_menu.setVisible(true);
        lvl_menu.setVisible(false);
    });
    lvl_menu.add(lvl_btn_back);

    lvl_menu.onHide(() => {
        sett_menu.setVisible(false);
        if (mainMenuMusic !== null && !main_menu.isVisible()) {
            mainMenuMusic.pause();
            mainMenuMusic = null;
        }
    });

    lvl_menu.onDisplay(async () => {
        if (mainMenuMusic == null) {
            mainMenuMusic = await AudioManager.loop(Sound.MAIN_REMIX, 0.1, 50, 70.8);
        }
    });

    Levels.getOrQueryLevelList().then(levels => {
        const baseX = 660;
        const baseY = 350;
        const dx = 150;
        const dy = 130;
        let cx = 0;
        let cy = 0;

        for (const level of levels) {
            const nbtn = new Button(levelIcons.getSprite(0, 1));
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



    // sort by z-index
    MenuManager.resort();

}


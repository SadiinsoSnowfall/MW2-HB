import { assert } from "../utils";

interface FontDef {
    name: string,
    ttf?: string,
    woff?: string,
    woff2?: string,
    use: number
}

export namespace Assets {
    let assetsLoaded: boolean = false;
    let imgs = new Map<string, HTMLImageElement>();
    let fonts = new Map<number, FontFace>();

    export function img(img: string): HTMLImageElement {
        const res = imgs.get(img);
        assert(res !== undefined, 'Assets#img undefined ressource');
        return res as HTMLImageElement;
    }

    /*
    export function font(font: number): FontFace {
        const res = fonts.get(font);
        assert(res !== undefined, 'Assets#img undefined ressource');
        return res as FontFace;
    }
    */

    export function load(): Promise<unknown> {
        assert(assetsLoaded == false, "More than one call to Assets#load");
        assetsLoaded = true;

        return Promise.all([
            //Promise.all(Object.values(Font).map(loadFont)),
            Promise.all(Object.values(Img).map(loadImage)),
        ]);
    }

    export function loadFont(def: FontDef): Promise<void> {
        return new Promise(resolve => {
            let src: string[] = [];
            if (def.ttf) {
                src.push(`url('${def.ttf}') format('truetype')`);
            }

            if (def.woff) {
                src.push(`url('${def.woff}') format('woff')`);
            }

            if (def.woff2) {
                src.push(`url('${def.woff2}') format('woff2')`);
            }

            console.log(def.name + " " + src.join(','));
            new FontFace(def.name, src.join(',')).load().then(ff => {
                fonts.set(def.use, ff);
                resolve();
            });  
        });
    }

    export function loadImage(url: string): Promise<void> {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                imgs.set(url, img);
                resolve();
            };
            img.src = url;
        });
    }

}

export const Font = Object.freeze({
    ANGRY_BIRD: {
        name: "AngryBirds",
        ttf: require('assets/fonts/AngryBirdsText-Regular.ttf'),
        use: 0
    },
});

export const Sound = Object.freeze({
    MAIN: require('assets/music/title_theme.ogg'),
    MAIN_REMIX: require('assets/music/SSvsAB_remix.ogg'),

    SLINGSHOT: require('assets/music/misc/slingshot_streched.ogg'),

    HIGHSCORE: require('assets/music/misc/highscore.ogg'),
    LEVEL_START_1: require('assets/music/misc/level_start_1.ogg'),
    LEVEL_START_2: require('assets/music/misc/level_start_2.ogg'),
    LEVEL_CLEAR_1: require('assets/music/misc/level_clear_1.ogg'),
    LEVEL_CLEAR_2: require('assets/music/misc/level_clear_2.ogg'),
    LEVEL_FAILED_1: require('assets/music/misc/level_failed_1.ogg'),
    LEVEL_FAILED_2: require('assets/music/misc/level_failed_2.ogg'),

    /**
     * BIRDS
     */

    BIRD_DESTROYED: require('assets/music/birds/bird_destroyed.ogg'),
    BIRD_SHOT_1: require('assets/music/birds/bird_shot_1.ogg'),
    BIRD_SHOT_2: require('assets/music/birds/bird_shot_2.ogg'),
    BIRD_SHOT_3: require('assets/music/birds/bird_shot_3.ogg'),
    BIRD_NEXT_1: require('assets/music/birds/bird_next_1.ogg'),
    BIRD_NEXT_2: require('assets/music/birds/bird_next_2.ogg'),
    BIRD_NEXT_3: require('assets/music/birds/bird_next_3.ogg'),
    
    BIRD_1: require('assets/music/birds/misc/bird_misc_1.ogg'),
    BIRD_2: require('assets/music/birds/misc/bird_misc_2.ogg'),
    BIRD_3: require('assets/music/birds/misc/bird_misc_3.ogg'),
    BIRD_4: require('assets/music/birds/misc/bird_misc_4.ogg'),
    BIRD_5: require('assets/music/birds/misc/bird_misc_5.ogg'),
    BIRD_6: require('assets/music/birds/misc/bird_misc_6.ogg'),
    BIRD_7: require('assets/music/birds/misc/bird_misc_7.ogg'),
    BIRD_8: require('assets/music/birds/misc/bird_misc_8.ogg'),
    BIRD_9: require('assets/music/birds/misc/bird_misc_9.ogg'),
    BIRD_10: require('assets/music/birds/misc/bird_misc_10.ogg'),
    BIRD_11: require('assets/music/birds/misc/bird_misc_11.ogg'),
    BIRD_12: require('assets/music/birds/misc/bird_misc_12.ogg'),

    BIRD_RED_SELECT: require('assets/music/birds/specific/red/bird_01_select.ogg'),
    BIRD_RED_FLY: require('assets/music/birds/specific/red/bird_01_flying.ogg'),
    BIRD_RED_HIT_1: require('assets/music/birds/specific/red/bird_01_collision_1.ogg'),
    BIRD_RED_HIT_2: require('assets/music/birds/specific/red/bird_01_collision_2.ogg'),
    BIRD_RED_HIT_3: require('assets/music/birds/specific/red/bird_01_collision_3.ogg'),
    BIRD_RED_HIT_4: require('assets/music/birds/specific/red/bird_01_collision_4.ogg'),

    BIRD_YELLOW_SELECT: require('assets/music/birds/specific/yellow/bird_03_select.ogg'),
    BIRD_YELLOW_FLY: require('assets/music/birds/specific/yellow/bird_03_flying.ogg'),
    BIRD_YELLOW_HIT_1: require('assets/music/birds/specific/yellow/bird_03_collision_1.ogg'),
    BIRD_YELLOW_HIT_2: require('assets/music/birds/specific/yellow/bird_03_collision_2.ogg'),
    BIRD_YELLOW_HIT_3: require('assets/music/birds/specific/yellow/bird_03_collision_3.ogg'),
    BIRD_YELLOW_HIT_4: require('assets/music/birds/specific/yellow/bird_03_collision_4.ogg'),
    BIRD_YELLOW_HIT_5: require('assets/music/birds/specific/yellow/bird_03_collision_5.ogg'),

    BIRD_BLUE_SELECT: require('assets/music/birds/specific/blue/bird_02_select.ogg'),
    BIRD_BLUE_FLY: require('assets/music/birds/specific/blue/bird_02_flying.ogg'),
    BIRD_BLUE_HIT_1: require('assets/music/birds/specific/blue/bird_02_collision_1.ogg'),
    BIRD_BLUE_HIT_2: require('assets/music/birds/specific/blue/bird_02_collision_2.ogg'),
    BIRD_BLUE_HIT_3: require('assets/music/birds/specific/blue/bird_02_collision_3.ogg'),
    BIRD_BLUE_HIT_4: require('assets/music/birds/specific/blue/bird_02_collision_4.ogg'),
    BIRD_BLUE_HIT_5: require('assets/music/birds/specific/blue/bird_02_collision_5.ogg'),

    BIRD_BLACK_SELECT: require('assets/music/birds/specific/black/bird_04_select.ogg'),
    BIRD_BLACK_FLY: require('assets/music/birds/specific/black/bird_04_flying.ogg'),
    BIRD_BLACK_HIT_1: require('assets/music/birds/specific/black/bird_04_collision_1.ogg'),
    BIRD_BLACK_HIT_2: require('assets/music/birds/specific/black/bird_04_collision_2.ogg'),
    BIRD_BLACK_HIT_3: require('assets/music/birds/specific/black/bird_04_collision_3.ogg'),
    BIRD_BLACK_HIT_4: require('assets/music/birds/specific/black/bird_04_collision_4.ogg'),

    BIRD_WHITE_SELECT: require('assets/music/birds/specific/white/bird_05_select.ogg'),
    BIRD_WHITE_FLY: require('assets/music/birds/specific/white/bird_05_flying.ogg'),
    BIRD_WHITE_HIT_1: require('assets/music/birds/specific/white/bird_05_collision_1.ogg'),
    BIRD_WHITE_HIT_2: require('assets/music/birds/specific/white/bird_05_collision_2.ogg'),
    BIRD_WHITE_HIT_3: require('assets/music/birds/specific/white/bird_05_collision_3.ogg'),
    BIRD_WHITE_HIT_4: require('assets/music/birds/specific/white/bird_05_collision_4.ogg'),
    BIRD_WHITE_HIT_5: require('assets/music/birds/specific/white/bird_05_collision_5.ogg'),
    BIRD_WHITE_EGG: require('assets/music/birds/specific/white/bird_pushing_egg_out.ogg'),

    BIRD_GREEN_SELECT: require('assets/music/birds/specific/green/boomerang_select.ogg'),
    BIRD_GREEN_FLY: require('assets/music/birds/specific/green/bird_06_flying.ogg'),
    BIRD_GREEN_ACTIVATE: require('assets/music/birds/specific/green/boomerang_activate.ogg'),
    BIRD_GREEN_SWISH: require('assets/music/birds/specific/green/boomerang_swish.ogg'),

    /**
     * BLOCKS
     */

    TNT: require('assets/music/blocks/tnt_explodes.ogg'),

    WOOD_HIT_1: require('assets/music/blocks/wood/wood_collision_1.ogg'),
    WOOD_HIT_2: require('assets/music/blocks/wood/wood_collision_2.ogg'),
    WOOD_HIT_3: require('assets/music/blocks/wood/wood_collision_3.ogg'),
    WOOD_HIT_4: require('assets/music/blocks/wood/wood_collision_4.ogg'),
    WOOD_HIT_5: require('assets/music/blocks/wood/wood_collision_5.ogg'),
    WOOD_HIT_6: require('assets/music/blocks/wood/wood_collision_6.ogg'),
    WOOD_BREAK_1: require('assets/music/blocks/wood/wood_damage_1.ogg'),
    WOOD_BREAK_2: require('assets/music/blocks/wood/wood_damage_2.ogg'),
    WOOD_BREAK_3: require('assets/music/blocks/wood/wood_damage_3.ogg'),
    WOOD_DESTROYED_1: require('assets/music/blocks/wood/wood_destroyed_1.ogg'),
    WOOD_DESTROYED_2: require('assets/music/blocks/wood/wood_destroyed_2.ogg'),
    WOOD_DESTROYED_3: require('assets/music/blocks/wood/wood_destroyed_3.ogg'),
    WOOD_ROLL: require('assets/music/blocks/wood/wood_rolling.ogg'),

    STONE_HIT_1: require('assets/music/blocks/rock/rock_collision_1.ogg'),
    STONE_HIT_2: require('assets/music/blocks/rock/rock_collision_2.ogg'),
    STONE_HIT_3: require('assets/music/blocks/rock/rock_collision_3.ogg'),
    STONE_HIT_4: require('assets/music/blocks/rock/rock_collision_4.ogg'),
    STONE_HIT_5: require('assets/music/blocks/rock/rock_collision_5.ogg'),
    STONE_BREAK_1: require('assets/music/blocks/rock/rock_damage_1.ogg'),
    STONE_BREAK_2: require('assets/music/blocks/rock/rock_damage_2.ogg'),
    STONE_BREAK_3: require('assets/music/blocks/rock/rock_damage_3.ogg'),
    STONE_DESTROYED_1: require('assets/music/blocks/rock/rock_destroyed_1.ogg'),
    STONE_DESTROYED_2: require('assets/music/blocks/rock/rock_destroyed_2.ogg'),
    STONE_DESTROYED_3: require('assets/music/blocks/rock/rock_destroyed_3.ogg'),
    STONE_ROLL: require('assets/music/blocks/rock/rock_rolling.ogg'),

    ICE_HIT_1: require('assets/music/blocks/ice/ice_hit_1.ogg'),
    ICE_HIT_2: require('assets/music/blocks/ice/ice_hit_2.ogg'),
    ICE_HIT_3: require('assets/music/blocks/ice/ice_hit_3.ogg'),
    ICE_BREAK_1: require('assets/music/blocks/ice/ice_break_1.ogg'),
    ICE_BREAK_2: require('assets/music/blocks/ice/ice_break_2.ogg'),
    ICE_BREAK_3: require('assets/music/blocks/ice/ice_break_2.ogg'),
    ICE_DESTROYED_1: require('assets/music/blocks/ice/light_destroyed_1.ogg'),
    ICE_DESTROYED_2: require('assets/music/blocks/ice/light_destroyed_2.ogg'),
    ICE_DESTROYED_3: require('assets/music/blocks/ice/light_destroyed_3.ogg'),

    SAND_BREAK: require('assets/music/blocks/sand/sand_break.ogg'),

    /**
     * PIGS
     */

    PIG_HI_1: require('assets/music/pigs/pig_hi_hat_1.ogg'),
    PIG_HI_2: require('assets/music/pigs/pig_hi_hat_2.ogg'),

    PIG_OINK_1: require('assets/music/pigs/pig_oink_1.ogg'),
    PIG_OINK_2: require('assets/music/pigs/pig_oink_2.ogg'),
    PIG_OINK_3: require('assets/music/pigs/pig_oink_3.ogg'),
    PIG_OINK_4: require('assets/music/pigs/pig_oink_4.ogg'),
    PIG_OINK_5: require('assets/music/pigs/pig_oink_5.ogg'),
    PIG_OINK_6: require('assets/music/pigs/pig_oink_6.ogg'),
    PIG_OINK_7: require('assets/music/pigs/pig_oink_7.ogg'),
    PIG_OINK_8: require('assets/music/pigs/pig_oink_8.ogg'),
    PIG_OINK_9: require('assets/music/pigs/pig_oink_9.ogg'),
    PIG_OINK_10: require('assets/music/pigs/pig_oink_10.ogg'),

    PIG_HIT_1: require('assets/music/pigs/pig_collision_1.ogg'),
    PIG_HIT_2: require('assets/music/pigs/pig_collision_2.ogg'),
    PIG_HIT_3: require('assets/music/pigs/pig_collision_3.ogg'),
    PIG_HIT_4: require('assets/music/pigs/pig_collision_4.ogg'),
    PIG_HIT_5: require('assets/music/pigs/pig_collision_5.ogg'),
    PIG_HIT_6: require('assets/music/pigs/pig_collision_6.ogg'),
    PIG_HIT_7: require('assets/music/pigs/pig_collision_7.ogg'),
    PIG_HIT_8: require('assets/music/pigs/pig_collision_8.ogg'),

    PIG_DAMAGE_1: require('assets/music/pigs/pig_damage_1.ogg'),
    PIG_DAMAGE_2: require('assets/music/pigs/pig_damage_2.ogg'),
    PIG_DAMAGE_3: require('assets/music/pigs/pig_damage_3.ogg'),
    PIG_DAMAGE_4: require('assets/music/pigs/pig_damage_4.ogg'),
    PIG_DAMAGE_5: require('assets/music/pigs/pig_damage_5.ogg'),
    PIG_DAMAGE_6: require('assets/music/pigs/pig_damage_6.ogg'),
    PIG_DAMAGE_7: require('assets/music/pigs/pig_damage_7.ogg'),
    PIG_DAMAGE_8: require('assets/music/pigs/pig_damage_8.ogg'),

    PIG_DESTROYED: require('assets/music/pigs/pig_destroyed.ogg'),
    
});

export const Img = Object.freeze({
    LEVELS_ICON: require('assets/images/blocks/levels_icon.png'),

    /**
     * BIRDS
     */

    BIRD_RED: require('assets/images/characters/red.png'),
    BIRD_YELLOW: require('assets/images/characters/yellow.png'),
    BIRD_BLUE: require('assets/images/characters/blue.png'),
    BIRD_BLACK: require('assets/images/characters/black.png'),
    BIRD_WHITE: require('assets/images/characters/white.png'),
    BIRD_GREEN: require('assets/images/characters/green.png'),
    BIRD_BIG: require('assets/images/characters/big.png'),

    /**
     * BLOCKS
     */

    MISC_MD: require('assets/images/blocks/misc_md.png'),
    MISC_LG: require('assets/images/blocks/misc_lg.png'),
    MISC_XL: require('assets/images/blocks/misc_xl.png'),
    MISC_XLV: require('assets/images/blocks/misc_xlv.png'),

    BALLS_MD: require('assets/images/blocks/balls_md.png'),
    BALLS_SM: require('assets/images/blocks/balls_sm.png'),

    CUBES_MD: require('assets/images/blocks/cubes_md.png'),
    CUBES_SM: require('assets/images/blocks/cubes_sm.png'),
    CUBES_XS: require('assets/images/blocks/cubes_xs.png'),
    CUBES_HOLLOW: require('assets/images/blocks/cubes_hollow.png'),

    TRIS_MD: require('assets/images/blocks/tris_md.png'),
    TRIS_SM: require('assets/images/blocks/tris_sm.png'),
    TRIS_HOLLOW: require('assets/images/blocks/tris_hollow.png'),
    
    FAT_PLANKS: require('assets/images/blocks/large_planks.png'),
    PLANKS_XL: require('assets/images/blocks/planks_xl.png'),
    PLANKS_LG: require('assets/images/blocks/planks_lg.png'),
    PLANKS_MD: require('assets/images/blocks/planks_md.png'),
    PLANKS_SM: require('assets/images/blocks/planks_sm.png'),
    PLANKS_XS: require('assets/images/blocks/planks_xs.png'),

    /**
     * PARTICLES
     */

    SCORES: require('assets/images/particles/scores.png'),
    SMOKE: require('assets/images/particles/smoke.png'),
    DEBRIS: require('assets/images/particles/debris.png'),
    FEATHERS: require('assets/images/particles/feathers.png'),
    EXPLOSION: require('assets/images/particles/explosion.png'),

    /**
     * PIGS
     */

    PIG_KING: require('assets/images/characters/pig_king.png'),
    PIG_MUSTACHE: require('assets/images/characters/pig_mustache.png'),
    PIG_HELMET: require('assets/images/characters/pig_helmet.png'),
    PIG_LG: require('assets/images/characters/pig_lg.png'),
    PIG_MD: require('assets/images/characters/pig_lg.png'),
    PIG_SM: require('assets/images/characters/pig_lg.png'),

    /**
     * MENUS
     */

    PLAYBTN: require('assets/images/menu/playbtn.png'),
    BUTTONS: require('assets/images/menu/buttons.png'),
    CURSOR: require('assets/images/menu/cursor.png'),
    POINTER: require('assets/images/menu/pointer.png'),
    SPLASH: require('assets/images/menu/splash.jpg'),
     
});
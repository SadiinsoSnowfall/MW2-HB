import { Settings, DefaultSettings } from "./settingsManager";

export namespace AudioManager {

    /**
    * May reduce replay loading time in expense of having to check if the
    * track is finished each audio frame
    */
    const alwaysWatchTimeUpdate: boolean = false;

    export async function playIfDefined(sound: string | undefined, volume: number = 1.0, from: number = 0, to?: number): Promise<HTMLAudioElement | null> {
        return sound ? await play(sound, volume, from, to) : null;
    }

    export async function play(sound: string, volume: number = 1.0, from: number = 0, to?: number): Promise<HTMLAudioElement | null> {
        const enabled = await Settings.get(DefaultSettings.SOUND_ENABLED, true);
        if (enabled) {
            const audio = new Audio(buildURI(sound, from, to));
            audio.volume = volume;
            audio.play();
            return audio;
        } else {
            return null;
        }
    }

    export async function loop(sound: string, volume: number = 1.0, from: number = 0, to?: number): Promise<HTMLAudioElement | null> {
        const enabled = await Settings.get(DefaultSettings.SOUND_ENABLED, true);
        if (!enabled) {
            return null;
        }

        const audio = new Audio(sound);
        audio.volume = volume;
        
        if (!to) {
            if (alwaysWatchTimeUpdate) {
                audio.currentTime = from;
                audio.ontimeupdate = () => {
                    if (audio.currentTime >= (audio.duration - 1)) {
                        audio.currentTime = from;
                    }
                };
            } else {
                if (!from) {
                    audio.loop = true;
                } else {
                    audio.currentTime = from;
                    audio.onended = () => {
                        audio.currentTime = from;
                        audio.play();
                    };
                }
            }
            
        } else { // end bound specified
            audio.currentTime = from;
            audio.ontimeupdate = () => {
                if (audio.currentTime >= to) {
                    audio.currentTime = from;
                }
            };
        }
        
        audio.play();
        return audio;
    }

    function buildURI(sound: string, from: number, to?: number) {
        return ((!from && !to) ? sound : sound + `#t=${from}` + (to ? ',' + to : ''));
    }
}
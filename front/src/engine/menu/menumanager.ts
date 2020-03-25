import { Menu } from ".";

export class MenuManager {

    private static menus: Menu[];

    public static addMenu(menu: Menu): void {
        MenuManager.menus.push(menu);
        MenuManager.menus.sort((a, b) => b.zIndex - a.zIndex); // sort by zIndex, descending order
    }

    public static captureEvent(e: MouseEvent): boolean {
        for (let i = 0; i < MenuManager.menus.length; ++i) {
            if (MenuManager.menus[i].captureEvent(e)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Draw the menus in z-index ascending order
     */
    public static drawMenus(ctx: CanvasRenderingContext2D): void {
        for (let i = MenuManager.menus.length - 1; i >= 0; --i) {
            MenuManager.menus[i].draw(ctx);
        }
    }

}
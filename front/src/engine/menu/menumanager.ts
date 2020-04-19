import { Menu } from ".";
import { Vec2 } from "../utils";

export class MenuManager {
    private static menus: Menu[] = [];

    public static resort(): void {
        MenuManager.menus.sort((a, b) => b.getZIndex() - a.getZIndex()); // sort by zIndex, descending order
    }

    public static addMenu(menu: Menu): Menu {
        MenuManager.menus.push(menu);
        MenuManager.resort(); // sort by zIndex
        return menu;
    }

    public static createMenu(): Menu {
        return MenuManager.addMenu(new Menu());
    }

    /**
     * Try capture the event in z-index descending order
     */
    public static captureEvent(e: MouseEvent, type: number, pos: Vec2): boolean {
        for (let i = 0; i < MenuManager.menus.length; ++i) {
            if (MenuManager.menus[i].captureEvent(e, type, pos)) {
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
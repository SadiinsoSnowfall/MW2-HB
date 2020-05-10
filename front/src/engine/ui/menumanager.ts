import { Menu } from "./menu";
import { Vec2 } from "../utils/vec2";

export namespace MenuManager {
    let menus: Menu[] = [];
    let lastHoverMenu: Menu | undefined = undefined;

    export function resort(): void {
        menus.sort((a, b) => b.getZIndex() - a.getZIndex()); // sort by zIndex, descending order
    }

    export function addMenu(menu: Menu): Menu {
        menus.push(menu);
        resort(); // sort by zIndex
        return menu;
    }

    export function createMenu(zIndex?: number): Menu {
        return addMenu(new Menu(zIndex));
    }

    /**
     * Try capture the event in z-index descending order
     */
    export function captureEvent(type: number, pos: Vec2): boolean {
        let captured: Menu | undefined = undefined;

        for (let i = 0; i < menus.length; ++i) {
            if (menus[i].captureEvent(type, pos)) {
                captured = menus[i];
                break;
            }
        }

        if (lastHoverMenu && (lastHoverMenu !== captured)) {
            lastHoverMenu.hoverLeft();
            lastHoverMenu = undefined;
        }

        if (captured) {
            lastHoverMenu = captured;
        }

        return captured !== undefined;
    }

    /**
     * Draw the menus in z-index ascending order
     */
    export function drawMenus(ctx: CanvasRenderingContext2D): void {
        for (let i = menus.length - 1; i >= 0; --i) {
            ctx.save();
            menus[i].draw(ctx);
            ctx.restore();
        }
    }

}
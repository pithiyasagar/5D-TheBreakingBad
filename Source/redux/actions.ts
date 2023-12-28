import { MY_FAVORITE } from "./types";

export function setFavourite(item: any) {
    return {
        type: MY_FAVORITE,
        payload: item
    }
}
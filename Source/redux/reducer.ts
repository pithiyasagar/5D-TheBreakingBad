import { MY_FAVORITE } from "./types"

const initialState = {
    favorite: []
}

export default function favouriteReducer(state = initialState, action: any) {

    if (action.type == MY_FAVORITE) {
        return {
            ...state,
            value: action.payload
        }
    }
    return state

}
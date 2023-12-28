import { combineReducers, createStore } from "redux";
import favouriteReducer from "./reducer";

const reducers = combineReducers({
    favorite: favouriteReducer
})

export const store = createStore(reducers)
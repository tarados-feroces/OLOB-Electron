import { Action as OrigAction, AnyAction, Reducer, applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { MapStateToProps as OrigMapStateToProps } from 'react-redux';
import thunk, { ThunkDispatch as OrigThunkDispatch, ThunkAction as OrigThunkAction } from 'redux-thunk';

import rootReducer from '../redux/index';

type GetReducerStateType<R> = R extends Reducer<infer S> ? S : never;

export type Action<T, D = undefined> = OrigAction<T> & (D extends undefined ? {} : {
    data: D;
});

export type ThunkAction<A extends OrigAction = AnyAction, R = void> = OrigThunkAction<R, AppState, void, A>;

export type MapStateToProps<StateProps, OwnProps> = OrigMapStateToProps<StateProps, OwnProps, AppState>;

export type ThunkDispatch<A extends OrigAction = AnyAction> = OrigThunkDispatch<AppState, void, A>;

export type MapDispatchToProps<DispatchProps, OwnProps> = (
    dispatch: ThunkDispatch,
    props: OwnProps
) => DispatchProps;

export type AppState = GetReducerStateType<typeof rootReducer>;

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );

    return store;
}

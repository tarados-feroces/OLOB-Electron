export const enum GameTypes {
    SEND_TURN = 'SEND_TURN',
    UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
    START_GAME = 'START_GAME',
    END_GAME = 'END_GAME',
    CLOSE_GAME = 'CLOSE_GAME'
}

export const enum GameMessages {
    SEARCH = 'Search',
    STARTED = 'Started',
    FINISHED = 'Finished',

    STEP = 'Step',
    UPDATE = 'UpdateState',
    SNAPSHOT = 'Snapshot',

    AREAS = 'Areas'
}

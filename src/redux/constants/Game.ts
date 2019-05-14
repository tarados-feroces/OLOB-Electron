export const enum GameTypes {
    SEND_TURN = 'SEND_TURN',
    UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
    START_GAME = 'START_GAME',
    END_GAME = 'END_GAME',
    CLOSE_GAME = 'CLOSE_GAME',
    OPPONENT_DISCONNECTED = 'OPPONENT_DISCONNECTED',
    RESEIVE_MESSAGE = 'RECEIVE_MESSAGE'
}

export const enum GameMessages {
    SEARCH = 'Search',
    STARTED = 'Started',
    FINISHED = 'Finished',
    OPPONENT_DISCONNECTED = 'OpponentDisconnected',
    DISCONNECT = 'Disconnect',

    STEP = 'Step',
    UPDATE = 'UpdateState',
    SNAPSHOT = 'Snapshot',

    AREAS = 'Areas',

    MESSAGE = 'Chat:Message',

    CHANGE_FIGURE = 'Change_Figure'
}

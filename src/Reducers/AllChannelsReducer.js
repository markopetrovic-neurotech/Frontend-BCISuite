import { RECEIVED_EEG_CHANNEL_DATA } from '../Actions/GetChannelData'

const initState = {
    currentData: []
}

export default function channels(state = initState, action){
    switch(action.type){
        case RECEIVED_EEG_CHANNEL_DATA:
            return Object.assign({}, state, {
                currentData: [
                    ...state.currentData,
                    {
                        channel_1: action.payload[0][0]
                    },
                ]
            })
        default:
            return state
    }
}
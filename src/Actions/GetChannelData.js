const RECEIVED_EEG_CHANNEL_DATA = "RECEIVED_EEG_CHANNEL_DATA"

export { RECEIVED_EEG_CHANNEL_DATA }

//this payload contains all 16 (temp) channels of data
export default function getChannelData(payload){
    return{
        type: RECEIVED_EEG_CHANNEL_DATA,
        payload
    }
}
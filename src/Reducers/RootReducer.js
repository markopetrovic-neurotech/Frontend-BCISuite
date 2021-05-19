import { combineReducers } from 'redux';

import channels from "./AllChannelsReducer"

const rootReducer = combineReducers({ 
  allChannelsReducer: channels
});

export default rootReducer;
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Screens from './Screens';
import Auth from './Auth';
import content from './Overview';

// Loading screen

export default createAppContainer(createSwitchNavigator({

  
  Auth,
  content,
  Main: Screens,
}));
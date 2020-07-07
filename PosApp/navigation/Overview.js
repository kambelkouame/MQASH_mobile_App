import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import Overview from "../screens/Overview";
import Signature from "../screens/Signature";
import Home from "../screens/Home";
import HeatMapComponent from "../screens/HeatMap";
import CarouselMap from "../screens/CarouselMap";

export default createStackNavigator({
  Overview,
  Signature,
  Home,
  HeatMapComponent,
  CarouselMap,

  
});

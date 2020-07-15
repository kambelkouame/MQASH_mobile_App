import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import Login from "../screens/Login";
import Register from "../screens/Register";
import Forgot from "../screens/Forgot";
import Email from "../screens/email";
import Sms from "../screens/sms";
import ConfirmSms from "../screens/confirmSms";
import ConfirmMail from "../screens/confirmMail";
import Camera2 from "../screens/camera2";



import Signature from "../screens/Signature";
export default createStackNavigator(
  {
    Login,
    Register,
    Forgot,
    Signature,
    Email,
    Sms,
    ConfirmMail,
    ConfirmSms,
    Camera2,
    
    

  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
